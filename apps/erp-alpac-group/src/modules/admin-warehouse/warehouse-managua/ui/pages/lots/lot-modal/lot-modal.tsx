import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { AXIS_OPTIONS, type LotFormValues, type LotModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/types/lot-modal.types";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { RegisterLotsPositionsCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-coordinates-req";
import {
	formatAmount,
	validateDecimalNumber,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { parseDecimal } from "@app/shared/utils/get-decimal.config";
import { useLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLot";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { CoordinateTargetTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/coordinate-target-type";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
	dropdownClassName,
	inputClassName,
	labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/style.lots";
import {
	buildDispersedLotPlacements,
	type DispersionAxis,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/lot-placement.utils";
import { buildPositions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/build-lot-positions.utils";
import { isSectionVertical } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/rack-coordinates.utils";

const createDefaultValues = (
	sectionWidth: number,
	sectionLength: number,
): LotFormValues => ({
	quantity: "",
	width: "",
	length: "",
	nominal_rows: "",
	nominal_columns: "",
	allows_stacking: false,
	disperse_axis: isSectionVertical(sectionLength, sectionWidth) ? "Y" : "X",
});

export const LotModal = ({
	isOpen,
	warehouseId,
	sectionId,
	sectionWidth = 0,
	sectionLength = 0,
	onClose,
	onSubmit,
}: LotModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const {
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
		AlertComponent
	} = useAlertState();

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<LotFormValues>({
		defaultValues: createDefaultValues(sectionWidth, sectionLength),
	});

	const { RegisterLot } = useLot();
	const { RegisterCoordinates, GetPositions } = useSection();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const watchQuantity = Number(watch("quantity") || 0);
	const watchWidth = Number(watch("width") || 0);
	const watchLength = Number(watch("length") || 0);
	const watchRows = Number(watch("nominal_rows") || 0);
	const watchColumns = Number(watch("nominal_columns") || 0);
	const watchAxis = watch("disperse_axis");

	const placement = useMemo(
		() =>
			buildDispersedLotPlacements({
				quantity: watchQuantity,
				width: watchWidth,
				length: watchLength,
				sectionWidth,
				sectionLength,
				axis: watchAxis,
			}),
		[
			watchQuantity,
			watchWidth,
			watchLength,
			sectionWidth,
			sectionLength,
			watchAxis,
		],
	);

	const positionsPreview = useMemo(
		() =>
			buildPositions({
				rows: watchRows,
				columns: watchColumns,
				lotWidth: watchWidth,
				lotLength: watchLength,
			}),
		[watchRows, watchColumns, watchWidth, watchLength],
	);

	const handleCreateLots = async (data: LotFormValues) => {
		const quantity = Number(data.quantity ?? 0);
		const width = Number(data.width ?? 0);
		const length = Number(data.length ?? 0);
		const nominalRows = Number(data.nominal_rows ?? 0);
		const nominalColumns = Number(data.nominal_columns ?? 0);

		if (sectionWidth <= 0 || sectionLength <= 0) {
			handleRequestError(
				"La sección no tiene dimensiones registradas. No se pueden ubicar los tramos.",
			);
			return;
		}

		const lotPlacement = buildDispersedLotPlacements({
			quantity,
			width,
			length,
			sectionWidth,
			sectionLength,
			axis: data.disperse_axis,
		});

		const lotPositions = buildPositions({
			rows: nominalRows,
			columns: nominalColumns,
			lotWidth: width,
			lotLength: length,
		});

		const validationError = [lotPlacement, lotPositions].find(
			(result) => !result.fits,
		)?.message;

		if (validationError) {
			handleRequestError(validationError);
			return;
		}

		const payload: RegisterLotRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: sectionId,
			lots: lotPlacement.lots.map((lot) => ({
				nominal_rows: nominalRows,
				nominal_columns: nominalColumns,
				width: lot.width,
				length: lot.length,
				allows_stacking: Boolean(data.allows_stacking),
				position_x: lot.position_x,
				position_y: lot.position_y,
				position_z: lot.position_z,
				rotation_y: lot.rotation_y,
			})),
		};

		setIsSubmitting(true);

		try {
			const positionsBefore = await GetPositions({
				company_id: companyId,
				module_code: moduleCode,
				warehouse_id: warehouseId,
				section_id: sectionId,
			});
			const existingLotIds = new Set(
				positionsBefore.blocks.map((block) => block.id),
			);

			await RegisterLot.mutateAsync(payload);

			const positionsAfter = await GetPositions({
				company_id: companyId,
				module_code: moduleCode,
				warehouse_id: warehouseId,
				section_id: sectionId,
			});
			const newLots = positionsAfter.blocks.filter(
				(block) => !existingLotIds.has(block.id),
			);

			if (newLots.length === 0) {
				handleRequestError(
					"Los tramos se crearon, pero no se encontraron posiciones para registrar coordenadas.",
				);
				return;
			}

			const COORDINATES_REQUEST_DELAY_MS = 300;

			for (let i = 0; i < newLots.length; i++) {
				const lot = newLots[i];
				const coordinatesPayload: RegisterLotsPositionsCoordinatesRequest = {
					company_id: companyId,
					module_code: moduleCode,
					warehouse_id: warehouseId,
					section_id: sectionId,
					target_type: CoordinateTargetTypeEnum.LotsPositions.value,
					lot_id: lot.id,
					lots_positions_information: lot.positions.map((position, index) => {
						const coordinate =
							lotPositions.positions[index]?.coordinate ?? {
								position_x: 0,
								position_y: 0,
								position_z: 0,
								rotation_y: 0,
							};

						return {
							lot_position_id: position.id,
							position_x: coordinate.position_x,
							position_y: coordinate.position_y,
							position_z: coordinate.position_z,
							rotation_y: coordinate.rotation_y,
						};
					}),
					rack_positions_information: [],
				};

				await RegisterCoordinates.mutateAsync(coordinatesPayload);

				if (i < newLots.length - 1) {
					await new Promise((resolve) =>
						setTimeout(resolve, COORDINATES_REQUEST_DELAY_MS),
					);
				}
			}

			handleRequestSuccess(
				"Tramos y coordenadas de posiciones registrados exitosamente.",
			);
			reset(createDefaultValues(sectionWidth, sectionLength));
			onSubmit?.(payload);
			setTimeout(onClose, 500);
		} catch (error) {
			handleRequestError(getMappedError(error as never).description);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		handleCloseAlert();
		reset(createDefaultValues(sectionWidth, sectionLength));
		onClose();
	};

	useEffect(() => {
		reset(createDefaultValues(sectionWidth, sectionLength));
	}, [isOpen, sectionWidth, sectionLength, reset]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de tramos"
			variant="form"
			size="5xl"
			description="Crea uno o varios tramos para la sección"
		>
			<form
				className="flex flex-col gap-6"
				onSubmit={handleSubmit(handleCreateLots)}
			>
				{AlertComponent}

				{/* Cantidad y eje */}
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<InputText
						label="Cantidad de tramos"
						type="text"
						inputMode="numeric"
						placeholder="Ej: 1"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("quantity", {
							required: "La cantidad de tramos es requerida",
							max: {
								value: 10,
								message: "Se permite un máximo de 10 tramos por petición.",
							},
							validate: {
								validateInteger: (value) =>
									!value || validateIntegerNumber(value),
								validatePositive: (value) =>
									!value ||
									validatePositiveNumber(value) === true ||
									"La cantidad de tramos debe ser mayor a 0.",
							},
							setValueAs: parseDecimal,
						})}
						error={errors.quantity?.message}
					/>

					<Controller
						control={control}
						name="disperse_axis"
						rules={{ required: "Seleccione el eje de dispersión" }}
						render={({ field }) => (
							<Dropdown
								label="Dispersar sobre"
								placeholder="Seleccione el eje..."
								isRequired
								options={AXIS_OPTIONS}
								value={field.value}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								onChange={(val) => field.onChange(val as DispersionAxis)}
								error={errors.disperse_axis?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="allows_stacking"
						render={({ field }) => (
							<div className="flex items-end pb-1">
								<Checkbox
									label="Permite estibado"
									labelPosition="right"
									className="text-slate-300!"
									checked={Boolean(field.value)}
									onChange={(e) => field.onChange(e.target.checked)}
								/>
							</div>
						)}
					/>
				</div>

				<div className="border-t border-t-slate-300 dark:border-t-neutral-600" />

				{/* Dimensiones */}
				<div className="flex flex-col gap-4">
					<div>
						<p className="m-0! text-[14px] font-semibold text-slate-700 dark:text-slate-200">
							Dimensiones de cada tramo
						</p>
						<p className="m-0! mt-1 text-[12px] text-slate-500 dark:text-slate-400">
							Ancho y largo en metros usados para ubicarlos en la sección.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<InputText
							label="Ancho (m)"
							type="text"
							inputMode="decimal"
							placeholder="Ej: 4.10"
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("width", {
								required: "El ancho es requerido",
								validate: {
									validateDecimal: (value) =>
										!value || validateDecimalNumber(value),
									validatePositive: (value) =>
										!value ||
										validatePositiveNumber(value) === true ||
										"El ancho (metros) debe ser mayor a 0.",
								},
								setValueAs: parseDecimal,
								onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
									evt.target.value = formatAmount(evt.target.value, 10, 2);
								},
							})}
							error={errors.width?.message}
						/>

						<InputText
							label="Largo (m)"
							type="text"
							inputMode="decimal"
							placeholder="Ej: 4.10"
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("length", {
								required: "El largo es requerido",
								validate: {
									validateDecimal: (value) =>
										!value || validateDecimalNumber(value),
									validatePositive: (value) =>
										!value ||
										validatePositiveNumber(value) === true ||
										"El largo (metros) debe ser mayor a 0.",
								},
								setValueAs: parseDecimal,
								onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
									evt.target.value = formatAmount(evt.target.value, 10, 2);
								},
							})}
							error={errors.length?.message}
						/>
					</div>
				</div>

				<div className="border-t border-t-slate-300 dark:border-t-neutral-600" />

				{/* Matriz */}
				<div className="flex flex-col gap-4">
					<div>
						<p className="m-0! text-[14px] font-semibold text-slate-700 dark:text-slate-200">
							Matriz de posiciones internas
						</p>
						<p className="m-0! mt-1 text-[12px] text-slate-500 dark:text-slate-400">
							Filas y columnas que componen cada tramo.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<InputText
							label="Cantidad de Filas"
							type="text"
							inputMode="numeric"
							placeholder="Ej: 4"
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("nominal_rows", {
								required: "Las filas son obligatorias",
								validate: {
									validateInteger: (value) =>
										!value || validateIntegerNumber(value),
									validatePositive: (value) =>
										!value || validatePositiveNumber(value),
								},
								setValueAs: parseDecimal,
							})}
							error={errors.nominal_rows?.message}
						/>

						<InputText
							label="Cantidad de Columnas"
							type="text"
							inputMode="numeric"
							placeholder="Ej: 5"
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("nominal_columns", {
								required: "Las columnas son obligatorias",
								validate: {
									validateInteger: (value) =>
										!value || validateIntegerNumber(value),
									validatePositive: (value) =>
										!value || validatePositiveNumber(value),
								},
								setValueAs: parseDecimal,
							})}
							error={errors.nominal_columns?.message}
						/>
					</div>
				</div>

				<Alert
					type={placement.fits ? "info" : "error"}
					title={`Distribución en eje ${placement.axis}`}
					message={`${placement.message} Sección disponible: ${sectionWidth.toFixed(2)} m (X) × ${sectionLength.toFixed(2)} m (Y).`}
					showCloseButton={false}
				/>

				<Alert
					type={positionsPreview.fits ? "info" : "error"}
					title="Posiciones (polines)"
					message={positionsPreview.message}
					showCloseButton={false}
				/>

				<div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

				<div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={handleClose}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
					/>
					<Button
						type="submit"
						size="giant"
						label="Guardar"
						isLoading={isSubmitting}
						disabled={
							isSubmitting ||
							!placement.fits ||
							!positionsPreview.fits
						}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
