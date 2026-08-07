import { AccordionItem } from "@alpac/design-system";
import {
	CircleCheckBigIcon,
	CircleXIcon,
	HashIcon,
	LayersIcon,
	NotebookTextIcon,
	PackageIcon,
	RulerIcon
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	requestedProduct,
	onRemove,
}: QuoteDetailAccordionProps) {

	const productName =
		requestedProduct?.product_details?.product_name?.trim() || "Nuevo producto";

	const categoryName =
		requestedProduct?.product_details?.category_information?.name?.trim() || null;

	const hasQuotation = requestedProduct?.has_quotation ?? false;

	const quantity = requestedProduct?.quantity;
	const quantityUnit = requestedProduct?.quantity_unit;
	const quantityLabel =
		quantity == null
			? null
			: quantityUnit != null
				? `${quantity} × ${quantityUnit}`
				: String(quantity);

	const unitMeasure =
		requestedProduct?.unit_measure_information?.name?.trim() ||
		requestedProduct?.unit_measure_information?.symbol?.trim() ||
		requestedProduct?.unit_measure_information?.code?.trim() ||
		null;

	const justification = requestedProduct?.justification?.trim() || null;

	const quotationStatusColor = hasQuotation ? "text-[#22c55e]" : "text-[#94a3b8]";

	return (
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
							{productName}
						</span>
						{categoryName ? (
							<span className="block text-[13px] font-normal text-slate-500 dark:text-slate-300">
								{categoryName}
							</span>
						) : null}

						<span className={`flex items-center gap-1 text-[13px] font-normal ${quotationStatusColor}`}>
							{
								hasQuotation ?
									<CircleCheckBigIcon size={15} color="#22c55e" /> :
									<CircleXIcon size={15} color="#94a3b8" />
							}
							{hasQuotation ? "Cotizado" : "Sin cotizar"}
						</span>
					</span>
				</div>
			}>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				<DetailField
					label="Producto"
					value={productName}
					icon={<PackageIcon size={18} />}
				/>
				<DetailField
					label="Categoría"
					value={categoryName ? categoryName : null}
					icon={<LayersIcon size={18} />}
				/>
				<DetailField
					label="Cantidad"
					value={quantityLabel}
					icon={<HashIcon size={18} />}
				/>
				<DetailField
					label="Unidad de medida"
					value={unitMeasure}
					icon={<RulerIcon size={18} />}
				/>
				<DetailField
					label="Justificación"
					value={justification}
					icon={<NotebookTextIcon size={18} />}
					containerClass="sm:col-span-2"
				/>
			</div>
		</AccordionItem>
	);
}
