import { useEffect } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import { useForm } from "react-hook-form";
import {
	formatAmount,
	validateDecimalNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { parseDecimal } from "@app/shared/utils/get-decimal.config";
import {
	inputClassName,
	labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";
import type {
	GaleronFormValues,
	GaleronModalProps,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-modal/types/galeron-modal.types";

const createDefaultValues = (): GaleronFormValues => ({
	width: "",
	length: "",
});

export const GaleronModal = ({ isOpen, onClose, onSubmit }: GaleronModalProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<GaleronFormValues>({
		defaultValues: createDefaultValues(),
	});

	const handleClose = () => {
		reset(createDefaultValues());
		onClose();
	};

	const handleCreateGaleron = (data: GaleronFormValues) => {
		const width = Number(data.width ?? 0);
		const length = Number(data.length ?? 0);

		onSubmit?.(width, length);
		reset(createDefaultValues());
		onClose();
	};

	useEffect(() => {
		if (!isOpen) return;
		reset(createDefaultValues());
	}, [isOpen, reset]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de galerón"
			variant="form"
			size="3xl"
			description="Indique el ancho y largo del galerón"
		>
			<form className="flex flex-col gap-6" onSubmit={handleSubmit(handleCreateGaleron)}>
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
								validateDecimal: (value) => !value || validateDecimalNumber(value),
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
								validateDecimal: (value) => !value || validateDecimalNumber(value),
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
