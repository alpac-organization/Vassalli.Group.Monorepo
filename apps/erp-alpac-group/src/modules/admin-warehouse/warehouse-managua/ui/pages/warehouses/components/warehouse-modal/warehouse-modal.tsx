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
import { getDecimalFieldConfig } from "@app/shared/utils/get-decimal.config";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
	dropdownClassName,
	inputClassName,
	labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/utils/styles";

const DEFAULT_FORM_VALUES: FormValues = {
	code: "",
	warehouse_type: WarehouseTypeEnum.Fiscal.value,
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
					Number(value) > Number(formValues.minimum_height) ||
					"La altura máxima debe ser mayor que la altura mínima"
				);
			},
		},
	};
})();

export function WarehouseModal({ isOpen, onClose, onSubmit }: WarehouseModalProps) {
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
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: DEFAULT_FORM_VALUES,
	});

	const hasMargins = useWatch({ control, name: "has_margins" });
	const { CreateWarehouse } = useWarehouse();

	const handleCreateWarehouse = (data: FormValues) => {
		const warehouseTypeOption = Object.values(WarehouseTypeEnum).find(
			(opt) => opt.value === Number(data.warehouse_type),
		);

		const payload: CreateWarehouseRequest = {
			company_id: companyId,
			module_code: moduleCode,
			code: data.code.trim().toUpperCase(),
			warehouse_type:
				warehouseTypeOption?.textValue ?? WarehouseTypeEnum.Fiscal.textValue,
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

	const handleClose = () => {
		handleCloseAlert();
		reset(DEFAULT_FORM_VALUES);
		onClose();
	};

	useEffect(() => {
		if (!isOpen) {
			reset(DEFAULT_FORM_VALUES);
		}
	}, [isOpen, reset]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de nueva bodega"
			variant="form"
			size="6xl"
			description="Complete el registro de bodega"
		>
			<form
				className="flex flex-col gap-5"
				onSubmit={handleSubmit(handleCreateWarehouse)}
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
											: String((value as { target?: { value?: string } })?.target?.value ?? "");
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
								rules={{ required: "El nombre de la ubicación es obligatorio" }}
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
							{...register("width", getDecimalFieldConfig("El ancho es requerido"))}
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
							{...register("length", getDecimalFieldConfig("El largo es requerido"))}
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
										getDecimalFieldConfig("El margen superior es requerido", true),
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
										getDecimalFieldConfig("El margen inferior es requerido", true),
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
										getDecimalFieldConfig("El margen izquierdo es requerido", true),
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
										getDecimalFieldConfig("El margen derecho es requerido", true),
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
						label="Guardar"
						isLoading={CreateWarehouse.isPending}
						disabled={CreateWarehouse.isPending}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
}
