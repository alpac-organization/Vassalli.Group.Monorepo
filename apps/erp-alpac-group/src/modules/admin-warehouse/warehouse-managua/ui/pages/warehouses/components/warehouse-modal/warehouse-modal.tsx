import { useEffect } from "react";
import {
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";
import { Controller, useForm, useWatch } from "react-hook-form";
import type {
	WarehouseModalProps,
	FormValues,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-modal/types/warehouse-modal.types";
import {
	WarehouseTypeEnum,
	WarehouseTypeOptions,
} from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { UpdateWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/update-warehouse-details-request";
import { getDecimalFieldConfig } from "@app/shared/utils/get-decimal.config";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import {
	dropdownClassName,
	inputClassName,
	labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/utils/styles";

const DEFAULT_FORM_VALUES: FormValues = {
	code: "",
	warehouse_type: WarehouseTypeEnum.Fiscal.value,
	is_active: true,
	has_margins: false,
	minimum_height: 0,
	margin_top: 0,
	margin_bottom: 0,
	margin_left: 0,
	margin_right: 0,
	warehouse_location: {
		location_name: "",
	},
};

const maximumHeightFieldConfig = (() => {
	const config = getDecimalFieldConfig("La altura máxima es requerida");
	return {
		...config,
		validate: {
			...config.validate,
			greaterThanMinimum: (
				value: unknown,
				formValues: FormValues,
			): true | string => {
				if (value === undefined || value === null || value === "") {
					return true;
				}
				if (
					formValues.minimum_height === undefined ||
					formValues.minimum_height === null
				) {
					return true;
				}
				return (
					Number(value) >= Number(formValues.minimum_height) ||
					"La altura máxima debe ser mayor o igual a la altura mínima"
				);
			},
		},
	};
})();

const resolveWarehouseTypeValue = (warehouseType: number) => {
	const warehouseTypeOption = Object.values(WarehouseTypeEnum).find(
		(opt) => opt.value === Number(warehouseType),
	);
	return warehouseTypeOption?.textValue ?? WarehouseTypeEnum.Fiscal.textValue;
};

const resolveWarehouseTypeNumber = (warehouseType: string | null | undefined) => {
	const match = Object.values(WarehouseTypeEnum).find(
		(opt) => opt.textValue === warehouseType,
	);
	return Number(match?.value ?? WarehouseTypeEnum.Fiscal.value);
};

export function WarehouseModal({
	isOpen,
	onClose,
	onSubmit,
	warehouse = null,
}: WarehouseModalProps) {
	const isEdit = warehouse != null;
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const {
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
		AlertComponent,
	} = useAlertState();

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: DEFAULT_FORM_VALUES,
	});

	const hasMargins = useWatch({ control, name: "has_margins" });

	const { CreateWarehouse, UpdateWarehouseDetails, GetWarehouseDetails } =
		useWarehouse({
			getWarehouseDetailsPayload:
				isOpen && warehouse
					? {
							company_id: companyId,
							module_code: moduleCode,
							warehouse_id: warehouse.warehouse_id,
						}
					: undefined,
		});

	useEffect(() => {
		if (!isOpen) {
			reset(DEFAULT_FORM_VALUES);
			return;
		}

		if (!warehouse) {
			reset(DEFAULT_FORM_VALUES);
		}
	}, [isOpen, warehouse, reset]);

	useEffect(() => {
		if (!isEdit || !GetWarehouseDetails.data) return;

		const details = GetWarehouseDetails.data;
		const capacity = details.capacity;

		setValue("code", details.code ?? "");
		setValue("warehouse_type", resolveWarehouseTypeNumber(details.warehouse_type));
		setValue("is_active", Boolean(details.is_active));
		setValue(
			"warehouse_location.location_name",
			details.location?.location_name ?? "",
		);
		setValue("width", capacity?.width);
		setValue("length", capacity?.length);
		setValue("minimum_height", capacity?.minimum_height ?? 0);
		setValue("maximum_height", capacity?.maximum_height);
		setValue("has_margins", Boolean(capacity?.has_margins));
		setValue("margin_top", capacity?.margin_top ?? 0);
		setValue("margin_bottom", capacity?.margin_bottom ?? 0);
		setValue("margin_left", capacity?.margin_left ?? 0);
		setValue("margin_right", capacity?.margin_right ?? 0);
	}, [isEdit, GetWarehouseDetails.data, setValue]);

	const handleCreateWarehouse = (data: FormValues) => {
		const payload: CreateWarehouseRequest = {
			company_id: companyId,
			module_code: moduleCode,
			code: data.code.trim().toUpperCase(),
			warehouse_type: resolveWarehouseTypeValue(data.warehouse_type),
			width: data.width!,
			length: data.length!,
			minimum_height: data.minimum_height ?? 0,
			maximum_height: data.maximum_height!,
			has_margins: data.has_margins,
			margin_top: data.has_margins ? (data.margin_top ?? 0) : 0,
			margin_bottom: data.has_margins ? (data.margin_bottom ?? 0) : 0,
			margin_left: data.has_margins ? (data.margin_left ?? 0) : 0,
			margin_right: data.has_margins ? (data.margin_right ?? 0) : 0,
			warehouse_location: {
				location_name: data.warehouse_location.location_name.trim(),
			},
		};

		CreateWarehouse.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Bodega registrada exitosamente.");
				reset(DEFAULT_FORM_VALUES);
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

	const handleUpdateWarehouse = (data: FormValues) => {
		if (!warehouse) return;

		const payload: UpdateWarehouseDetailsRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouse.warehouse_id,
			code: data.code.trim().toUpperCase(),
			is_active: data.is_active,
			warehouse_type: resolveWarehouseTypeValue(data.warehouse_type),
			location: {
				location_name: data.warehouse_location.location_name.trim(),
			},
			capacity: {
				width: data.width!,
				length: data.length!,
				minimum_height: data.minimum_height ?? 0,
				maximum_height: data.maximum_height!,
				has_margins: data.has_margins,
				margin_top: data.has_margins ? (data.margin_top ?? 0) : 0,
				margin_bottom: data.has_margins ? (data.margin_bottom ?? 0) : 0,
				margin_left: data.has_margins ? (data.margin_left ?? 0) : 0,
				margin_right: data.has_margins ? (data.margin_right ?? 0) : 0,
			},
		};

		UpdateWarehouseDetails.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Bodega actualizada exitosamente.");
				reset(DEFAULT_FORM_VALUES);
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
		reset(DEFAULT_FORM_VALUES);
		onClose();
	};

	const isPending =
		CreateWarehouse.isPending ||
		UpdateWarehouseDetails.isPending ||
		(isEdit && GetWarehouseDetails.isFetching);

	return (
		<>
			{UpdateWarehouseDetails.isPending && (
				<Loader title="Actualizando bodega..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={isEdit ? "Actualizar bodega" : "Registro de nueva bodega"}
				variant="form"
				size="6xl"
				description={
					isEdit
						? "Actualice la información de la bodega"
						: "Complete el registro de bodega"
				}
			>
				<form
					className="flex flex-col gap-5"
					onSubmit={handleSubmit(
						isEdit ? handleUpdateWarehouse : handleCreateWarehouse,
					)}
				>
					{AlertComponent}

					<div className="flex items-stretch flex-col gap-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Controller
								control={control}
								name="code"
								rules={{
									required: "El código es requerido",
									maxLength: {
										value: 20,
										message: "El código no puede superar los 20 caracteres",
									},
								}}
								render={({ field }) => (
									<InputText
										label="Código"
										placeholder="Ej. WH-001"
										isRequired
										maxLength={20}
										className={inputClassName}
										labelClassName={labelClassName}
										value={field.value ?? ""}
										onChange={(value) => {
											const next =
												typeof value === "string"
													? value
													: String(
															(value as { target?: { value?: string } })?.target
																?.value ?? "",
														);
											field.onChange(next.toUpperCase());
										}}
										error={errors.code?.message}
									/>
								)}
							/>

							<Controller
								control={control}
								name="warehouse_type"
								rules={{ required: "El tipo de bodega es requerido" }}
								render={({ field }) => (
									<Dropdown
										label="Tipo de bodega"
										placeholder="Seleccione..."
										isRequired
										options={WarehouseTypeOptions}
										value={field.value}
										appearance="dark"
										className={dropdownClassName}
										labelClassName={labelClassName}
										onChange={(val) => field.onChange(val)}
										error={errors.warehouse_type?.message}
									/>
								)}
							/>

							<div className="md:col-span-2">
								<Controller
									control={control}
									name="warehouse_location.location_name"
									rules={{
										required: "El nombre de la ubicación es obligatorio",
									}}
									render={({ field }) => (
										<InputText
											label="Ubicación"
											placeholder="Ej. Almacenadora del Pacífico - Managua"
											isRequired
											className={inputClassName}
											labelClassName={labelClassName}
											value={field.value ?? ""}
											onChange={field.onChange}
											error={errors.warehouse_location?.location_name?.message}
										/>
									)}
								/>
							</div>

							{isEdit ? (
								<Controller
									control={control}
									name="is_active"
									render={({ field }) => (
										<div className="flex grow-0 shrink-0 items-center">
											<Checkbox
												label="Bodega activa"
												labelPosition="right"
												className="text-slate-300!"
												checked={Boolean(field.value)}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
										</div>
									)}
								/>
							) : null}
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<InputText
								label="Ancho (m)"
								type="text"
								inputMode="decimal"
								placeholder="0.00"
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								{...register(
									"width",
									getDecimalFieldConfig("El ancho es requerido"),
								)}
								error={errors.width?.message}
							/>

							<InputText
								label="Largo (m)"
								type="text"
								inputMode="decimal"
								placeholder="0.00"
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								{...register(
									"length",
									getDecimalFieldConfig("El largo es requerido"),
								)}
								error={errors.length?.message}
							/>

							<InputText
								label="Altura mínima (m)"
								type="text"
								inputMode="decimal"
								placeholder="0.00"
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								{...register(
									"minimum_height",
									getDecimalFieldConfig("La altura mínima es requerida", true),
								)}
								error={errors.minimum_height?.message}
							/>

							<InputText
								label="Altura máxima (m)"
								type="text"
								inputMode="decimal"
								placeholder="0.00"
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								{...register("maximum_height", maximumHeightFieldConfig)}
								error={errors.maximum_height?.message}
							/>
						</div>

						<div className="flex flex-col gap-6">
							<Controller
								control={control}
								name="has_margins"
								render={({ field }) => (
									<div className="flex grow-0 shrink-0 items-center">
										<Checkbox
											label="Aplicar márgenes"
											labelPosition="right"
											className="text-slate-300!"
											checked={Boolean(field.value)}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
									</div>
								)}
							/>

							{hasMargins && (
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
									<InputText
										label="Margen superior (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(
											"margin_top",
											getDecimalFieldConfig(
												"El margen superior es requerido",
												true,
											),
										)}
										error={errors.margin_top?.message}
									/>

									<InputText
										label="Margen inferior (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(
											"margin_bottom",
											getDecimalFieldConfig(
												"El margen inferior es requerido",
												true,
											),
										)}
										error={errors.margin_bottom?.message}
									/>

									<InputText
										label="Margen izquierdo (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(
											"margin_left",
											getDecimalFieldConfig(
												"El margen izquierdo es requerido",
												true,
											),
										)}
										error={errors.margin_left?.message}
									/>

									<InputText
										label="Margen derecho (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(
											"margin_right",
											getDecimalFieldConfig(
												"El margen derecho es requerido",
												true,
											),
										)}
										error={errors.margin_right?.message}
									/>
								</div>
							)}
						</div>
					</div>

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
							label={isEdit ? "Actualizar" : "Guardar"}
							isLoading={isPending}
							disabled={isPending}
							className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
						/>
					</div>
				</form>
			</Modal>
		</>
	);
}
