import {
	AccordionItem,
	Button,
	ContextMenu,
} from "@alpac/design-system";
import { PlusIcon, Trash2 } from "lucide-react";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	requestedProduct,
	onRemove,

}: QuoteDetailAccordionProps) {

	return (
		<>
			<AccordionItem
				value={accordionValue}
				className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
				contentClassName="p-4"
				title={
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{quoteDetailIndex + 1}
						</span>
						<span className="flex min-w-0 flex-row items-center justify-center gap-4">
							<span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
								{requestedProduct?.product_details?.product_name ?? "Nuevo producto"}
							</span>
							{requestedProduct?.product_details?.category_information?.name ? (
								<span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
									{requestedProduct?.product_details?.category_information?.name}
								</span>
							) : null}
						</span>
					</div>
				}
			>
				<div className="mb-4 flex flex-row items-end justify-end gap-3">

				</div>
			</AccordionItem>
		</>
	);
}
