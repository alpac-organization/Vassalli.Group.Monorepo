import { AccordionItem, Checkbox } from "@alpac/design-system";
import {
	CircleCheckBigIcon,
	CircleXIcon,
	HashIcon,
	LayersIcon,
	NotebookTextIcon,
	PackageIcon,
	RulerIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";
import { useState } from "react";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	requestedProduct,
	onSelectedChange,
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

	const quotationStatusColor = hasQuotation ? "text-[#22c55e]" : "text-slate-500 dark:text-slate-300";	

	const [isSelected, setIsSelected] = useState(false);

	return (
		<>
			<AccordionItem
				value={accordionValue}
				isOpen={true}
				className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
				contentClassName="p-4"

				title={
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{quoteDetailIndex + 1}
						</span>
						<span
							className="flex h-8 shrink-0 items-center "
							onClick={(evt) => evt.stopPropagation()}
							onKeyDown={(evt) => evt.stopPropagation()}
						>
							{
								hasQuotation ?
									<Checkbox
										labelClassName="block truncate text-[15px] font-semibold text-slate-800 dark:text-white"
										label={productName}
										checked
										disabled
									/> :
									<Checkbox
										name={`select-quote-product-${quoteDetailIndex}`}
										checked={isSelected}
										label={productName}
										labelClassName="block truncate text-[15px] font-semibold text-slate-800 dark:text-white"
										onChange={(evt) => {
											const isChecked = evt.target.checked ?? false;
											setIsSelected(isChecked);
											onSelectedChange?.(requestedProduct!, isChecked);
										}}
										aria-label={`Seleccionar ${productName}`}
									/>
							}

						</span>

						{categoryName ?
							<span className="flex h-8 min-w-0 flex-row items-center justify-center font-normal text-slate-500 dark:text-slate-300">
								/
							</span> : null
						}

						{categoryName ?
							<span className="block text-[14px] font-normal text-slate-500 dark:text-slate-300">
								{categoryName ?? ""}
							</span> : null
						}

						<span className="flex h-8 min-w-0 flex-row items-center justify-center font-normal text-slate-500 dark:text-slate-300">
							/
						</span>

						<span className={`flex items-center gap-1 text-[14px] font-normal ${quotationStatusColor}`}>
							{
								hasQuotation ?
									<CircleCheckBigIcon size={14} color="#22c55e" /> :
									<CircleXIcon size={15} color="#94a3b8" />
							}
							{
								hasQuotation ?
									<span>Cotizado</span> :
									<span>Sin cotizar</span>
							}
						</span>
					</div>
				}>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
					<div className="order-2 grid min-w-0 flex-1 grid-cols-1 gap-4 sm:order-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
				</div>
			</AccordionItem>
		</>
	);
}
