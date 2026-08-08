import { AccordionItem, Button, ContextMenu } from "@alpac/design-system";
import {
	CircleCheckBigIcon,
	CircleXIcon,
	HashIcon,
	LayersIcon,
	NotebookTextIcon,
	PackageIcon,
	PlusIcon,
	RulerIcon,
	Trash2Icon
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";
import { SelectSupplierModal } from "../select-supplier-modal/select-supplier-modal";
import { SupplierModal } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal";
import { useState } from "react";
import type { CreatedSupplierDto } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { CreateQuote, Supplier } from "../../types/create-quote-form.types";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	requestedProduct,
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

	const { control } = useFormContext<CreateQuote>();

	const suppliers = `requested_products.${quoteDetailIndex}.suppliers` as `requested_products.${number}.suppliers`;

	const { fields, append, remove } = useFieldArray({
		control, name: suppliers
	});

	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);

	const handleSelectRegisteredSuppliers = (suppliers: GetSuppliersResponse[]) => {
		const existingIds = new Set(fields.map((item) => item.supplier_id));
		const suppliersToAdd = suppliers.filter(
			(supplier) => !existingIds.has(supplier.supplier_id),
		);

		if (suppliersToAdd.length === 0) return;

		const mappedSuppliers: Supplier[] = suppliersToAdd.map((supplier) => ({
			supplier_id: supplier.supplier_id,
			supplier_legal_name: supplier.supplier_legal_name,
			is_wholesale: false,			
			additional_data: [
				{
					brand: "",
					images_base64: [],
					warranty_information: {
						has_warranty: false,
						quantity_days: 0,
						quantity_months: 0,
					},
				},
			],
		}));

		append(mappedSuppliers);
	};

	const handleCreatedSupplier = (supplier: CreatedSupplierDto) => {
		const supplierId = supplier.data.supplier_id;

		const existingIds = new Set(fields.map((item) => item.supplier_id));

		if (existingIds.has(supplierId)) return;

		const mappedSupplier: Supplier = {
			supplier_id: supplierId,
			supplier_legal_name: supplier.supplier_name,
			is_wholesale: false,								
			additional_data: [
				{
					brand: "",
					images_base64: [],
					warranty_information: {
						has_warranty: false,
						quantity_days: 0,
						quantity_months: 0,
					},
				},
			],
		}

		append(mappedSupplier);
	};

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

					<div className="order-1 flex shrink-0 items-start justify-start sm:order-2 sm:justify-end">
						<div className="flex flex-wrap gap-3 sm:h-12">
							<ContextMenu
								items={[
									{
										label: "Agregar Nuevo Proveedor",
										onClick() {
											setIsSupplierModalOpen(true);
										},
									},
									{
										label: "Agregar Proveedor Existente",
										onClick() {
											setIsSelectSupplierOpen(true);
										},
									},
								]}
								triggerLabel="Agregar Proveedor"
								triggerIcon={<PlusIcon size={18} />}
								triggerClassName="text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
								triggerButtonSize="giant"
							/>
						</div>
					</div>
				</div>

				{fields.map((field, supplierIndex) => {
					const additionalData = field.additional_data?.[0];
					const warranty = additionalData?.warranty_information;
					const additionalDataLabel = additionalData
						? [
								additionalData.brand?.trim() || null,
								warranty?.has_warranty
									? `Garantía: ${warranty.quantity_days}d / ${warranty.quantity_months}m`
									: "Sin garantía",
								`${additionalData.images_base64?.length ?? 0} imagen(es)`,
							]
								.filter(Boolean)
								.join(" · ")
						: null;

					return (
						<div
							key={field.id}
							className="mt-4 flex flex-col gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-600 dark:bg-[#1e2229]"
						>
							<div className="flex items-center justify-between gap-3">
								<div className="min-w-0 font-semibold text-slate-800 dark:text-white">
									{field?.supplier_legal_name ?? ""}
								</div>
								<Button
									type="button"
									size="small"
									tooltip="Eliminar proveedor"
									icon={<Trash2Icon size={18} />}
									onClick={() => remove(supplierIndex)}
									className={`${quoteFormDangerButtonClassName} h-12 w-12!`}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<DetailField
									label="Razón social"
									value={field?.supplier_legal_name ?? ""}
								/>
								<DetailField
									label="Es mayoreo"
									value={field?.is_wholesale ? "Sí" : "No"}
								/>								
								<DetailField
									label="Datos adicionales"
									value={additionalDataLabel}
									containerClass="sm:col-span-2 lg:col-span-3"
								/>
							</div>
						</div>
					);
				})}
			</AccordionItem>

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				selectionType="multiple"
				excludeSupplierIds={[]}
				onSelect={handleSelectRegisteredSuppliers}
			/>

			<SupplierModal
				isOpen={isSupplierModalOpen}
				onClose={() => setIsSupplierModalOpen(false)}
				onSubmit={(supplier) => {
					handleCreatedSupplier(supplier);
					setIsSupplierModalOpen(false);
				}}
			/>
		</>
	);
}
