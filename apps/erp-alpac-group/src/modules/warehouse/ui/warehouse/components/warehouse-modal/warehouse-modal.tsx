import { useEffect } from "react";
import { Alert, AnimatedAlertWrapper, Button, Dropdown, InputText, Modal } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { WarehouseModalProps } from "./warehouse-modal.types";
import { WarehouseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import {
	formatAmount,
	validateDecimalNumber,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	`${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const parseDecimal = (value: unknown) => {
	const trimmed = String(value ?? "").trim();
	return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};

export const WarehouseModal = ({ isOpen, onClose }: WarehouseModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateWarehouseRequest>();

	const { CreateWarehouse } = useWarehouse();

	const handleCreateWarehouse = (data: CreateWarehouseRequest) => {
		const payload: CreateWarehouseRequest = {
			...data,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: "b90caa3f-83ae-4aac-a57e-2546052e9f6d",
		};

		CreateWarehouse.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Bodega registrada exitosamente.");
				reset();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
	};

	const handleClose = () => {
		handleCloseAlert();
		reset();
		onClose();
	};

	useEffect(() => {
		if (!isOpen) {
			reset();
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
				<AnimatedAlertWrapper open={alertState?.open ?? false}>
					<Alert
						type={alertState?.type!}
						title={alertState?.title}
						message={alertState?.message!}
						onClose={handleCloseAlert}
					/>
				</AnimatedAlertWrapper>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Controller
						control={control}
						name="warehouse_name"
						rules={{ required: "El nombre de la bodega es requerido" }}
						render={({ field }) => (
							<InputText
								label="Nombre de la bodega"
								placeholder="Ej. Bodega 1"
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value ?? ""}
								onChange={field.onChange}
								error={errors.warehouse_name?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="warehouse_information.warehouse_type"
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
								valueClassName="text-black! dark:text-white!"
								onChange={(value) => field.onChange(Number(value))}
								error={errors.warehouse_information?.warehouse_type?.message}
							/>
						)}
					/>

					<InputText
						label="Capacidad cúbica total (m3)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.total_cubic_capacity", {
							required: "La capacidad cúbica total es requerida",
							validate: {
								validateDecimal: (value) => validateDecimalNumber(value),
								validatePositive: (value) => validatePositiveNumber(value),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.warehouse_information?.total_cubic_capacity?.message}
					/>

					<InputText
						label="Área total (m2)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.total_area", {
							required: "El área total es requerida",
							validate: {
								validateDecimal: (value) => validateDecimalNumber(value),
								validatePositive: (value) => validatePositiveNumber(value),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.warehouse_information?.total_area?.message}
					/>

					<InputText
						label="Área no utilizable (m2)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.unusable_area", {
							required: "El área no utilizable es requerida",
							validate: {
								validateDecimal: (value) => validateDecimalNumber(value),
								validatePositive: (value) => validatePositiveNumber(value, true),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.warehouse_information?.unusable_area?.message}
					/>

					<InputText
						label="Altura máxima (m)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.max_height", {
							required: "La altura máxima es requerida",
							validate: {
								validateDecimal: (value) => validateDecimalNumber(value),
								validatePositive: (value) => validatePositiveNumber(value),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.warehouse_information?.max_height?.message}
					/>

					<InputText
						label="Altura mínima (m)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.min_height", {
							required: "La altura mínima es requerida",
							validate: {
								validateDecimal: (value) => validateDecimalNumber(value),
								validatePositive: (value) => validatePositiveNumber(value),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.warehouse_information?.min_height?.message}
					/>

					<InputText
						label="Cantidad de rampas"
						type="text"
						inputMode="decimal"
						placeholder="0.0"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.rampas_count", {
							required: "La cantidad de rampas es requerida",
							validate: {
								validateDecimal: (value) => validateIntegerNumber(value),
								validatePositive: (value) => validatePositiveNumber(value, true),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 3, 0);
							},
						})}
						error={errors.warehouse_information?.rampas_count?.message}
					/>

					<InputText
						label="Espacios de parqueo"
						type="text"
						inputMode="decimal"
						placeholder="0.0"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("warehouse_information.parking_spaces_count", {
							required: "Los espacios de parqueo son requeridos",
							validate: {
								validateDecimal: (value) => validateIntegerNumber(value),
								validatePositive: (value) => validatePositiveNumber(value, true),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 3, 0);
							},
						})}
						error={errors.warehouse_information?.parking_spaces_count?.message}
					/>
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
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
