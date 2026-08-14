import { useEffect } from "react";
import { Alert, AnimatedAlertWrapper, Button, Checkbox, Dropdown, InputText, Modal } from "@alpac/design-system";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { LotModalProps } from "./lot-modal.types";
import { RackStatusEnum, RackStatusOptions } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import type { CreateLotsRequest, RegisterLotGroupRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-lots-request";
import {
	formatAmount,
	validateDecimalNumber,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
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

type LotGroupFormValues = {
	mode: "codes" | "range";
	codes_text?: string;
	code_prefix?: string;
	start_number?: string;
	count?: string;
	width_metres?: string;
	length_metres?: string;
	nominal_rows?: string;
	nominal_columns?: string;
	allows_stacking: boolean;
	status: number;
	unavailable_reason?: string;
};

type FormValues = {
	groups: LotGroupFormValues[];
};

const isUnavailableStatus = (status: number) =>
	status === RackStatusEnum.UnderMaintenance.value || status === RackStatusEnum.Blocked.value;

export const LotModal = ({ isOpen, sectionId, onClose, onSubmit }: LotModalProps) => {
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
		watch,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			groups: [
				{
					mode: "codes",
					allows_stacking: true,
					status: RackStatusEnum.Available.value,
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "groups",
	});

	const { CreateLots } = useWarehouseLayout();

	const handleCreateLots = (data: FormValues) => {
		const groups: RegisterLotGroupRequest[] = data.groups.map((group) => {
			const statusOption = Object.values(RackStatusEnum).find(
				(option) => option.value === Number(group.status),
			);
			const status = statusOption ? statusOption.textValue : RackStatusEnum.Available.textValue;

			return {
				codes:
					group.mode === "codes"
						? (group.codes_text ?? "")
								.split(",")
								.map((code) => code.trim())
								.filter(Boolean)
						: null,
				code_prefix: group.mode === "range" ? group.code_prefix ?? null : null,
				start_number: group.mode === "range" ? Number(group.start_number) : null,
				count: group.mode === "range" ? Number(group.count) : null,
				width_metres: Number(group.width_metres),
				length_metres: Number(group.length_metres),
				nominal_rows: Number(group.nominal_rows),
				nominal_columns: Number(group.nominal_columns),
				allows_stacking: group.allows_stacking,
				status,
				unavailable_reason: isUnavailableStatus(Number(group.status))
					? group.unavailable_reason ?? null
					: null,
			};
		});

		const payload: CreateLotsRequest = {
			company_id: companyId,
			module_code: moduleCode,
			section_id: sectionId,
			groups,
		};

		CreateLots.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Tramos registrados exitosamente.");
				reset();
				if (onSubmit) onSubmit(payload);

				setTimeout(() => {
					onClose();
				}, 2000);
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
			title="Registro de tramos"
			variant="form"
			size="7xl"
			description="Registre uno o varios tramos para la sección"
		>
			<form
				className="flex flex-col gap-5"
				onSubmit={handleSubmit(handleCreateLots)}
			>
				<AnimatedAlertWrapper open={alertState?.open ?? false}>
					<Alert
						type={alertState?.type!}
						title={alertState?.title}
						message={alertState?.message!}
						onClose={handleCloseAlert}
					/>
				</AnimatedAlertWrapper>

				<div className="flex flex-col gap-6">
					{fields.map((field, index) => {
						const groupStatus = Number(watch(`groups.${index}.status`));
						const groupMode = watch(`groups.${index}.mode`);
						const showUnavailableReason = isUnavailableStatus(groupStatus);

						return (
							<div
								key={field.id}
								className="rounded-xl border border-[#2a2d3d] bg-[#1b1e27] p-4"
							>
								<div className="mb-3 flex items-center justify-between">
									<p className="text-sm font-medium text-slate-300">
										Grupo de tramos #{index + 1}
									</p>
									{fields.length > 1 && (
										<Button
											type="button"
											size="small"
											label="Eliminar"
											icon={<Trash2 size={14} />}
											onClick={() => remove(index)}
											className="text-[13px]! rounded-md! bg-red-600/15! border! border-red-700/40! text-red-400! hover:bg-red-600/25!"
										/>
									)}
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
									<Controller
										control={control}
										name={`groups.${index}.mode`}
										rules={{ required: "El modo es requerido" }}
										render={({ field: modeField }) => (
											<Dropdown
												label="Modo de registro"
												placeholder="Seleccione..."
												isRequired
												options={[
													{ value: "codes", label: "Códigos específicos" },
													{ value: "range", label: "Rango de códigos" },
												]}
												value={modeField.value}
												appearance="dark"
												className={dropdownClassName}
												labelClassName={labelClassName}
												onChange={(val) => modeField.onChange(val)}
											/>
										)}
									/>

									{groupMode === "codes" ? (
										<InputText
											label="Códigos (separados por coma)"
											placeholder="Ej. LOT-A1, LOT-A2, LOT-A3"
											isRequired
											className={inputClassName}
											labelClassName={labelClassName}
											{...register(`groups.${index}.codes_text`, {
												required: "Al menos un código es requerido",
												validate: {
													hasCodes: (value) =>
														(value ?? "")
															.split(",")
															.some((code) => code.trim() !== "") || "Ingrese al menos un código",
												},
											})}
											error={errors.groups?.[index]?.codes_text?.message}
										/>
									) : (
										<>
											<InputText
												label="Prefijo"
												placeholder="Ej. LOT-B"
												isRequired
												className={inputClassName}
												labelClassName={labelClassName}
												{...register(`groups.${index}.code_prefix`, {
													required: "El prefijo es requerido",
												})}
												error={errors.groups?.[index]?.code_prefix?.message}
											/>

											<InputText
												label="Número inicial"
												type="text"
												inputMode="numeric"
												placeholder="1"
												isRequired
												className={inputClassName}
												labelClassName={labelClassName}
												{...register(`groups.${index}.start_number`, {
													required: "El número inicial es requerido",
													validate: {
														validateInteger: (value) =>
															!value || validateIntegerNumber(value),
														validatePositive: (value) => !value || validatePositiveNumber(value),
													},
													setValueAs: parseDecimal,
												})}
												error={errors.groups?.[index]?.start_number?.message}
											/>

											<InputText
												label="Cantidad"
												type="text"
												inputMode="numeric"
												placeholder="10"
												isRequired
												className={inputClassName}
												labelClassName={labelClassName}
												{...register(`groups.${index}.count`, {
													required: "La cantidad es requerida",
													validate: {
														validateInteger: (value) =>
															!value || validateIntegerNumber(value),
														validatePositive: (value) => !value || validatePositiveNumber(value),
													},
													setValueAs: parseDecimal,
												})}
												error={errors.groups?.[index]?.count?.message}
											/>
										</>
									)}

									<InputText
										label="Ancho (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(`groups.${index}.width_metres`, {
											required: "El ancho es requerido",
											validate: {
												validateDecimal: (value) => !value || validateDecimalNumber(value),
												validatePositive: (value) => !value || validatePositiveNumber(value),
											},
											setValueAs: parseDecimal,
											onChange: (evt) => {
												evt.target.value = formatAmount(evt.target.value, 10, 2);
											},
										})}
										error={errors.groups?.[index]?.width_metres?.message}
									/>

									<InputText
										label="Largo (m)"
										type="text"
										inputMode="decimal"
										placeholder="0.00"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(`groups.${index}.length_metres`, {
											required: "El largo es requerido",
											validate: {
												validateDecimal: (value) => !value || validateDecimalNumber(value),
												validatePositive: (value) => !value || validatePositiveNumber(value, true),
											},
											setValueAs: parseDecimal,
											onChange: (evt) => {
												evt.target.value = formatAmount(evt.target.value, 10, 2);
											},
										})}
										error={errors.groups?.[index]?.length_metres?.message}
									/>

									<InputText
										label="Filas"
										type="text"
										inputMode="numeric"
										placeholder="4"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(`groups.${index}.nominal_rows`, {
											required: "Las filas son requeridas",
											validate: {
												validateInteger: (value) =>
													!value || validateIntegerNumber(value),
												validatePositive: (value) => !value || validatePositiveNumber(value),
											},
											setValueAs: parseDecimal,
										})}
										error={errors.groups?.[index]?.nominal_rows?.message}
									/>

									<InputText
										label="Columnas"
										type="text"
										inputMode="numeric"
										placeholder="5"
										isRequired
										className={inputClassName}
										labelClassName={labelClassName}
										{...register(`groups.${index}.nominal_columns`, {
											required: "Las columnas son requeridas",
											validate: {
												validateInteger: (value) =>
													!value || validateIntegerNumber(value),
												validatePositive: (value) => !value || validatePositiveNumber(value),
											},
											setValueAs: parseDecimal,
										})}
										error={errors.groups?.[index]?.nominal_columns?.message}
									/>

									<Controller
										control={control}
										name={`groups.${index}.status`}
										rules={{ required: "El estado es requerido" }}
										render={({ field: statusField }) => (
											<Dropdown
												label="Estado"
												placeholder="Seleccione..."
												isRequired
												options={RackStatusOptions}
												value={statusField.value}
												appearance="dark"
												className={dropdownClassName}
												labelClassName={labelClassName}
												onChange={(val) => statusField.onChange(val)}
												error={errors.groups?.[index]?.status?.message}
											/>
										)}
									/>

									<Controller
										control={control}
										name={`groups.${index}.allows_stacking`}
										render={({ field: stackingField }) => (
											<Checkbox
												label="Permite apilamiento"
												labelPosition="right"
												className="text-slate-300!"
												checked={stackingField.value}
												onChange={stackingField.onChange}
											/>
										)}
									/>

									{showUnavailableReason && (
										<InputText
											label="Motivo de indisponibilidad"
											placeholder="Ej. Reparación estructural del piso"
											isRequired
											className={inputClassName}
											labelClassName={labelClassName}
											{...register(`groups.${index}.unavailable_reason`, {
												required: "El motivo es requerido para este estado",
											})}
											error={errors.groups?.[index]?.unavailable_reason?.message}
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div>
					<Button
						type="button"
						size="medium"
						label="Agregar grupo"
						icon={<Plus size={16} />}
						onClick={() =>
							append({
								mode: "codes",
								allows_stacking: true,
								status: RackStatusEnum.Available.value,
							})
						}
						className="text-[14px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30!"
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
						isLoading={CreateLots.isPending}
						disabled={CreateLots.isPending}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};