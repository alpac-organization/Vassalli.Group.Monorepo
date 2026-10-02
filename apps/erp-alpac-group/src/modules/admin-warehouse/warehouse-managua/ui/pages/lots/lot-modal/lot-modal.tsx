import { useEffect, useMemo } from "react";
import {
	Alert,
	Button,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { AXIS_OPTIONS, type LotFormValues, type LotModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/types/lot-modal.types";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import {
	formatAmount,
	validateDecimalNumber,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { parseDecimal } from "@app/shared/utils/get-decimal.config";
import { useLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLot";
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

	const watchQuantity = Number(watch("quantity") || 0);
	const watchWidth = Number(watch("width") || 0);
	const watchLength = Number(watch("length") || 0);
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

	const handleCreateLots = (data: LotFormValues) => {
		const quantity = Number(data.quantity ?? 0);
		const width = Number(data.width ?? 0);
		const length = Number(data.length ?? 0);

		if (sectionWidth <= 0 || sectionLength <= 0) {
			handleRequestError(
				"La sección no tiene dimensiones registradas. No se pueden ubicar los tramos."
			);
			return;
		}

		const nextPlacement = buildDispersedLotPlacements({
			quantity,
			width,
			length,
			sectionWidth,
			sectionLength,
			axis: data.disperse_axis,
		});

		if (!nextPlacement.fits) {
			handleRequestError(nextPlacement.message);
			return;
		}

		const payload: RegisterLotRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: sectionId,
			lots: nextPlacement.lots.map((item) => ({
				...item,
				nominal_rows: Number(data.nominal_rows ?? 0),
				nominal_columns: Number(data.nominal_columns ?? 0),
			})),
		};

		RegisterLot.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Tramos registrados exitosamente.");
				reset(createDefaultValues(sectionWidth, sectionLength));
				onSubmit?.(payload);

				setTimeout(() => {
					onClose();
				}, 500);
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
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
						isLoading={RegisterLot.isPending}
						disabled={RegisterLot.isPending || !placement.fits}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
