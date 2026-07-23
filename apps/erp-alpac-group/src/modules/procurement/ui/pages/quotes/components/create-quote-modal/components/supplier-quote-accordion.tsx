import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
	AccordionGroup,
	AccordionItem,
	Button,
	InputText,
} from "@alpac/design-system";
import { Trash2 } from "lucide-react";
import type { CreateQuoteFormValues } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { ProductQuoteFields } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/product-quote-fields/product-quote-fields";
import {
	quoteFormDangerButtonClassName,
	quoteFormInputClassName,
	quoteFormLabelClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

type SupplierQuoteAccordionProps = {
	// supplierIndex: number;
	accordionValue: string;
	canRemove: boolean;
	onRemove: () => void;
};

export function SupplierQuoteAccordion({
	// supplierIndex,
	accordionValue,
	canRemove,
	onRemove,
}: SupplierQuoteAccordionProps) {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<CreateQuoteFormValues>();

	const { fields } = useFieldArray({
		control,
		name: `quote_details`,
	});

	/* 	const [openProducts, setOpenProducts] = useState<string[]>(() =>
			fields.map((field) => field.client_id),
		);
	 */
	/* 	const supplier = useWatch({
			control,
			name: `suppliers.${supplierIndex}`,
		}); */

	// const supplierErrors = errors.suppliers?.[supplierIndex];
	// const path = `suppliers.${supplierIndex}` as const;
	// const productCount = supplier?.products?.length ?? fields.length;
	// const supplierName = supplier?.supplier_legal_name?.trim();
	// const isRegistered =
	// 	Boolean(supplier?.supplier_id) && !supplier?.is_new_supplier;

	return (
		<AccordionItem
			value={accordionValue}
			className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
			contentClassName="px-4! pb-4!"
			title={
				<div className="flex min-w-0 items-center gap-3">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
						1
					</span>
					<span className="min-w-0">
						<span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
							Proveedor
						</span>						
					</span>
				</div>
			}
		>
			<div className="flex flex-col gap-6 pt-4 dark:border-t-neutral-600">
				{canRemove && (
					<div className="flex justify-end">
						<Button
							type="button"
							size="small"
							label="Eliminar proveedor"
							icon={<Trash2 size={16} />}
							onClick={onRemove}
							className={quoteFormDangerButtonClassName}
						/>
					</div>
				)}

				<div className="grid grid-cols-3 gap-6">

					<div className="">
						<InputText
							label="Razón social del proveedor"
							placeholder="Ej: Repuestos El Rápido"
							isRequired
							// error={supplierErrors?.supplier_legal_name?.message}
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
						// readOnly={isRegistered}
						// {...register(`${path}.supplier_legal_name`, {
						// required: "Ingrese la razón social del proveedor.",
						// validate: (value) =>
						// value.trim().length >= 2 ||
						// "La razón social debe tener al menos 2 caracteres.",
						//})}
						/>
					</div>

					<InputText
						label="Nombre del contacto"
						placeholder="Ej: Carlos Ruiz"
						isRequired
						// error={supplierErrors?.contact_name?.message}
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
					// readOnly={isRegistered}
					// {...register(`${path}.contact_name`, {
					// required: "Ingrese el nombre del contacto.",
					// })}
					/>
					<InputText
						type="tel"
						label="Teléfono del contacto"
						placeholder="+505 8888-8888"
						// error={supplierErrors?.contact_phone_number?.message}
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
					// readOnly={isRegistered}
					// {...register(`${path}.contact_phone_number`)}
					/>
				</div>

				<div className="flex items-center justify-between gap-3">
					<h4 className="m-0! text-[14px]! font-bold text-slate-800 dark:text-white!">
						Productos cotizados
					</h4>
				</div>				
			</div>
		</AccordionItem>
	);
}
