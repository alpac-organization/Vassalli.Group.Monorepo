import { useFormContext, useWatch } from "react-hook-form";
import { AccordionItem, Button } from "@alpac/design-system";
import { Trash2 } from "lucide-react";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";
import type { CreateQuote } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	supplier,
	onRemove,
}: QuoteDetailAccordionProps) {

	const { control } = useFormContext<CreateQuote>();

	const products = useWatch({
		control,
		name: `quote_details.${quoteDetailIndex}.products`,
	});

	const productsCount = products?.length ?? 0;

	return (
		<>
			<AccordionItem
				value={accordionValue}
				className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
				contentClassName="px-4! pb-4!"
				title={
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{quoteDetailIndex + 1}
						</span>
						<span className="flex flex-row justify-center items-center gap-4 min-w-0">
							<span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
								{supplier?.supplier_legal_name ?? "Nuevo proveedor"}
							</span>
							<span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
								{productsCount} {productsCount === 1 ? "producto" : "productos"}
							</span>
						</span>
					</div>
				}
			>
				<div className="flex flex-col gap-4 pt-4 dark:border-t-neutral-600">

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

					<div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">

					</div>

				</div>
			</AccordionItem>
		</>
	);
}
