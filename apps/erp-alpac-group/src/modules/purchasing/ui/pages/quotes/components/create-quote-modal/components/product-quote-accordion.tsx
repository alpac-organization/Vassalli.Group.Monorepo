import { useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
	AccordionItem,
	Button,
	ContextMenu,
	InputText,
} from "@alpac/design-system";
import { Trash2 } from "lucide-react";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";
import type { CreateQuoteFormValues } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { SelectSupplierModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal";
import { SupplierModal } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal";
import {
	quoteFormDangerButtonClassName,
	quoteFormInputClassName,
	quoteFormLabelClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

type ProductQuoteAccordionProps = {
	accordionValue: string;
	productId: string;
	productName: string;
	unitOfMeasure: string;
	unitMeasureId: string;
	quantity: number;
	index: number;
	canRemove: boolean;
	suppliers: GetSuppliersResponse[];
	isLoadingSuppliers?: boolean;
	onRemove: () => void;
};

export function ProductQuoteAccordion({
	accordionValue,
	productId,
	productName,
	unitOfMeasure,
	unitMeasureId,
	quantity,
	index,
	canRemove,
	suppliers,
	isLoadingSuppliers = false,
	onRemove,
}: ProductQuoteAccordionProps) {
	const { control, getValues } = useFormContext<CreateQuoteFormValues>();
	const { fields: quoteDetails, append, remove } = useFieldArray({
		control,
		name: "quote_details",
	});

	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);

	const suppliersById = useMemo(
		() => new Map(suppliers.map((supplier) => [supplier.supplier_id, supplier])),
		[suppliers],
	);

	const assignedQuoteIndexes = useMemo(() => {
		return quoteDetails
			.map((detail, detailIndex) => ({ detail, detailIndex }))
			.filter(({ detail }) => detail.product_id === productId);
	}, [quoteDetails, productId]);

	const handleSelectRegisteredSupplier = (supplier: GetSuppliersResponse) => {
		const alreadyAssigned = getValues("quote_details")?.some(
			(detail) =>
				detail.product_id === productId &&
				detail.supplier_id === supplier.supplier_id,
		);
		if (alreadyAssigned) return;

		append({
			is_new_product: false,
			is_new_supplier: false,
			amount: 0,
			product_id: productId,
			supplier_id: supplier.supplier_id,
			unit_measure_id: unitMeasureId,
			additional_data: {
				quantity,
			},
		});
	};

	return (
		<>
			<AccordionItem
				value={accordionValue}
				className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
				contentClassName="px-4! pb-4!"
				title={
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{index + 1}
						</span>
						<span className="flex flex-row justify-center items-center gap-4 min-w-0">
							<span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
								{productName || `Producto ${index + 1}`}
							</span>
							<span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
								{assignedQuoteIndexes.length}{" "}
								{assignedQuoteIndexes.length === 1
									? "proveedor"
									: "proveedores"}
							</span>
						</span>
					</div>
				}
			>
				<div className="flex flex-col gap-4 pt-4 dark:border-t-neutral-600">
					{canRemove && (
						<div className="flex justify-end">
							<Button
								type="button"
								size="small"
								label="Eliminar producto"
								icon={<Trash2 size={16} />}
								onClick={onRemove}
								className={quoteFormDangerButtonClassName}
							/>
						</div>
					)}

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<InputText
							type="text"
							label="Producto"
							value={productName}
							readOnly
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
						/>

						<InputText
							type="text"
							label="Cantidad"
							value={String(quantity ?? 0)}
							readOnly
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
						/>

						<InputText
							type="text"
							label="Unidad de Medida"
							value={unitOfMeasure}
							readOnly
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
						/>
					</div>

					<div className="flex items-center justify-between gap-3">
						<h4 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
							Proveedores asignados
						</h4>
						<ContextMenu
							items={[
								{
									label: "Nuevo proveedor",
									onClick: () => setIsSupplierModalOpen(true),
								},
								{
									label: "Seleccionar existente",
									onClick: () => setIsSelectSupplierOpen(true),
								},
							]}
						/>
					</div>

					{assignedQuoteIndexes.length === 0 ? (
						<p className="m-0 text-[14px]! text-slate-500 dark:text-slate-400">
							Aún no hay proveedores asignados a este producto.
						</p>
					) : (
						<ul className="m-0! flex list-none flex-col gap-1 p-0">
							{assignedQuoteIndexes.map(({ detail, detailIndex }) => {
								const supplier = suppliersById.get(detail.supplier_id);
								const supplierLabel =
									supplier?.supplier_legal_name ?? "Proveedor";
								const contactLabel = supplier?.contact_name;

								return (
									<li
										key={`${detail.supplier_id}-${detailIndex}`}
										className="flex h-10 items-center gap-2 rounded border border-slate-200 px-2 dark:border-slate-600"
									>
										<span className="min-w-0 flex-1 truncate text-[14px] text-slate-700 dark:text-slate-200">
											{supplierLabel}
											{contactLabel ? (
												<span className="text-slate-400 dark:text-slate-500">
													{" "}
													· {contactLabel}
												</span>
											) : null}
										</span>

										<div className="flex flex-row gap-2 w-50 items-center justify-center shrink-0">
											<label htmlFor="total_cost" className="text-[14px] whitespace-nowrap">Precio Unitario:</label>
											<Controller
												control={control}
												name={`quote_details.${detailIndex}.amount`}
												render={({ field }) => (
													<input
														id="total_cost"
														type="number"
														step="0.01"
														min="0"
														placeholder="Precio"
														value={field.value ?? ""}
														onChange={field.onChange}
														aria-label={`Precio de ${supplierLabel}`}
														className="h-6 w-full rounded border border-slate-300 bg-transparent px-1.5 text-[12px] text-slate-800 outline-none focus:border-alpac-primary-500 dark:border-slate-600 dark:text-white"
													/>
												)}
											/>
										</div>

										<button
											type="button"
											aria-label="Quitar proveedor"
											onClick={() => remove(detailIndex)}
											className="inline-flex h-8 w-6 shrink-0 items-center justify-center rounded text-red-500 hover:bg-red-500/10 dark:text-red-400"
										>
											<Trash2 size={16} />
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</AccordionItem>

			<SelectSupplierModal
				key={
					isSelectSupplierOpen
						? `select-supplier-${productId}-open`
						: `select-supplier-${productId}-closed`
				}
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				suppliers={suppliers}
				isLoading={isLoadingSuppliers}
				onSelect={handleSelectRegisteredSupplier}
			/>

			<SupplierModal
				isOpen={isSupplierModalOpen}
				onClose={() => setIsSupplierModalOpen(false)}
				onSubmit={() => {
					// Pendiente: al crear, obtener supplier_id y asignarlo a este producto
					setIsSupplierModalOpen(false);
				}}
			/>
		</>
	);
}
