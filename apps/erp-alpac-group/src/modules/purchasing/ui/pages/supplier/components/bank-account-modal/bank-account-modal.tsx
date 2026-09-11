import { useEffect } from "react";
import { Button, Checkbox, Dropdown, InputText, Modal } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { BankAccountModalProps } from "./bank-account-modal.types";
import type { CreateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { BankAccountTypeOptions } from "@app/core/enums/bank-account-type.enum";
import { inputClassName, labelClassName, dropdownClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

const currencyOptions = [
	{ value: "NIO", label: "Córdobas (C$)" },
	{ value: "USD", label: "Dólares ($)" },
];

const emptyValues: CreateSupplierBankAccountPayload = {
	bank_name: "",
	account_number: "",
	account_type: "Checking",
	currency: "USD",
	account_holder_name: "",
	account_holder_identification: "",
	is_primary: false,
};

export const BankAccountModal = ({
	isOpen,
	onClose,
	onSubmit,
	editingAccount,
	isLoading = false,
}: BankAccountModalProps) => {
	const isEditing = Boolean(editingAccount?.id || editingAccount?.account_number);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateSupplierBankAccountPayload>({
		defaultValues: emptyValues,
	});

	useEffect(() => {
		if (!isOpen) {
			reset(emptyValues);
			return;
		}

		if (editingAccount) {
			reset({
				bank_name: editingAccount.bank_name ?? "",
				account_number: editingAccount.account_number ?? "",
				account_type: String(editingAccount.account_type ?? "Checking"),
				currency: String(editingAccount.currency ?? "USD"),
				account_holder_name: editingAccount.account_holder_name ?? "",
				account_holder_identification: editingAccount.account_holder_identification ?? "",
				is_primary: Boolean(editingAccount.is_primary),
			});
		} else {
			reset(emptyValues);
		}
	}, [isOpen, editingAccount, reset]);

	const handleFormSubmit = (data: CreateSupplierBankAccountPayload) => {
		onSubmit({
			...data,
			account_holder_identification: data.account_holder_identification?.trim() || null,
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEditing ? "Editar cuenta bancaria" : "Agregar cuenta bancaria"}
			variant="form"
			size="2xl"
			description="Ingrese los datos de la cuenta bancaria del proveedor"
		>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<InputText
						label="Nombre del banco"
						placeholder="Ej. BAC Credomatic"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("bank_name", {
							required: "El nombre del banco es requerido",
						})}
						error={errors.bank_name?.message}
					/>

					<InputText
						label="Número de cuenta"
						placeholder="Ej. 362849102"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("account_number", {
							required: "El número de cuenta es requerido",
						})}
						error={errors.account_number?.message}
					/>

					<Controller
						control={control}
						name="account_type"
						rules={{ required: "El tipo de cuenta es requerido" }}
						render={({ field }) => (
							<Dropdown
								label="Tipo de cuenta"
								placeholder="Seleccione..."
								isRequired
								options={BankAccountTypeOptions}
								value={field.value}
								onChange={(val) => field.onChange(String(val))}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								valueClassName="text-black! dark:text-white!"
								error={errors.account_type?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="currency"
						rules={{ required: "La moneda es requerida" }}
						render={({ field }) => (
							<Dropdown
								label="Moneda"
								placeholder="Seleccione..."
								isRequired
								options={currencyOptions}
								value={field.value}
								onChange={(val) => field.onChange(String(val))}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								valueClassName="text-black! dark:text-white!"
								error={errors.currency?.message}
							/>
						)}
					/>

					<div className="md:col-span-2">
						<InputText
							label="Nombre del titular"
							placeholder="Ej. Distribuidora Industrial S.A."
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("account_holder_name", {
								required: "El nombre del titular es requerido",
							})}
							error={errors.account_holder_name?.message}
						/>
					</div>

					<div className="md:col-span-2">
						<InputText
							label="Identificación del titular (opcional)"
							placeholder="Ej. J0310000045678 o 001-150885-0012X"
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("account_holder_identification")}
						/>
					</div>

					<div className="md:col-span-2">
						<Controller
							control={control}
							name="is_primary"
							render={({ field }) => (
								<div className="flex flex-col gap-1">
									<Checkbox
										label="Marcar como cuenta principal"
										checked={Boolean(field.value)}
										disabled={isEditing && Boolean(editingAccount?.is_primary)}
										onChange={(e) => field.onChange(e.target.checked)}
									/>
									{isEditing && Boolean(editingAccount?.is_primary) && (
										<span className="text-xs text-slate-500 dark:text-slate-400">
											Esta cuenta es la principal. Para cambiarla, establezca otra cuenta como principal.
										</span>
									)}
								</div>
							)}
						/>
					</div>
				</div>

				<div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 my-2" />

				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						className="w-full sm:w-auto text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600!"
					/>
					<Button
						type="submit"
						size="giant"
						label="Guardar cuenta"
						disabled={isLoading}
						isLoading={isLoading}
						className="w-full sm:w-auto text-[15px]! rounded-md! bg-alpac-primary-500 text-white!"
					/>
				</div>
			</form>
		</Modal>
	);
};
