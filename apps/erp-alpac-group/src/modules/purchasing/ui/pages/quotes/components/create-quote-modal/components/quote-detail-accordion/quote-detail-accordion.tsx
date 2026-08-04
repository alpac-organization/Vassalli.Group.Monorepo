import { useState } from "react";
import {
	AccordionItem,
	Button,
	Checkbox,
	ContextMenu,
	InputText,
	RadioButton,
} from "@alpac/design-system";
import { PlusIcon, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { SelectSupplierModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal/select-supplier-modal";
import { SupplierModal } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";
import type { CreateQuote, Supplier } from "../../types/create-quote-form.types";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { CreatedSupplierDto } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type WarrantyUnit = "days" | "months";

const toNumberValue = (value: string) =>
	value === "" ? 0 : Number(value);

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	product,
	onRemove,
}: QuoteDetailAccordionProps) {
	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);
	const [warrantyUnitBySupplier, setWarrantyUnitBySupplier] = useState<
		Record<string, WarrantyUnit>
	>({});

	const categoryName = product?.category?.name;

	const { control, setValue } = useFormContext<CreateQuote>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: `quote_details.${quoteDetailIndex}.suppliers` as `quote_details.${number}.suppliers`,
	});

	const watchedSuppliers = useWatch({
		control,
		name: `quote_details.${quoteDetailIndex}.suppliers` as `quote_details.${number}.suppliers`,
	});

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
			quantity: 0,
			quantity_per_unit: 0,
			price: 0,
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
			quantity: 0,
			quantity_per_unit: 0,
			price: 0,
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
								{product?.product_name ?? "Nuevo producto"}
							</span>
							{categoryName ? (
								<span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
									{categoryName}
								</span>
							) : null}
						</span>
					</div>
				}
			>
				<div className="mb-4 flex flex-row items-end justify-end gap-3">
					<div className="flex h-12 gap-4">
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

						<Button
							type="button"
							size="giant"
							tooltip="Eliminar Ítem"
							icon={<Trash2 size={18} />}
							onClick={onRemove}
							className={`${quoteFormDangerButtonClassName}`}
						/>
					</div>
				</div>

				{fields.length > 0 && (
					<div className="-mx-6 mb-6 border-t border-t-slate-300 dark:border-t-neutral-600" />
				)}

				<div className="flex flex-col gap-3">
					{fields.map((field, supplierIndex) => {

						const basePath =
							`quote_details.${quoteDetailIndex}.suppliers.${supplierIndex}` as const;

						const warrantyPath =
							`${basePath}.additional_data.0.warranty_information` as const;

						const warrantyUnit = warrantyUnitBySupplier[field.id] ?? "days";

						const warrantyRadioName = `warranty-unit-${field.id}`;

						const hasWarranty = Boolean(
							watchedSuppliers?.[supplierIndex]?.additional_data?.[0]
								?.warranty_information?.has_warranty,
						);

						const handleWarrantyUnitChange = (unit: WarrantyUnit) => {
							setWarrantyUnitBySupplier((prev) => ({
								...prev,
								[field.id]: unit,
							}));

							if (unit === "days") {
								setValue(`${warrantyPath}.quantity_months`, 0);
							} else {
								setValue(`${warrantyPath}.quantity_days`, 0);
							}
						};

						return (
							<div
								key={field.id}
								className="rounded-md border border-slate-200 p-3 dark:border-slate-600"
							>
								<div className="mb-3 flex items-center justify-between gap-3">
									<div className="min-w-0 font-semibold text-slate-800 dark:text-white">
										{field.supplier_legal_name}
									</div>
									<Button
										type="button"
										size="small"
										tooltip="Eliminar proveedor"
										icon={<Trash2 size={18} />}
										onClick={() => remove(supplierIndex)}
										className={`${quoteFormDangerButtonClassName} h-12 w-12!`}
									/>
								</div>

								<div className="mb-3 flex flex-wrap gap-4">
									<Controller
										control={control}
										name={`${basePath}.is_wholesale`}
										render={({ field: wholesaleField }) => (
											<div className="flex h-12 items-center">
												<Checkbox
													label="Mayoreo"
													checked={Boolean(wholesaleField.value)}
													onChange={(e) => {
														wholesaleField.onChange(e.target.checked);
													}}
													className="whitespace-nowrap"
												/>
											</div>
										)}
									/>

									<Controller
										control={control}
										name={`${warrantyPath}.has_warranty`}
										render={({ field: warrantyField }) => (
											<div className="flex h-12 items-center">
												<Checkbox
													label="Tiene Garantía"
													checked={Boolean(warrantyField.value)}
													onChange={(e) => {
														warrantyField.onChange(e.target.checked);
													}}
													className="whitespace-nowrap"
												/>
											</div>
										)}
									/>

									{
										hasWarranty && (
											<>
												<div className="flex h-12 items-center">
													<RadioButton
														id={`warranty-in-days-${field.id}`}
														name={warrantyRadioName}
														value="warrantyInDays"
														label="Garantía en Días"
														labelPosition="right"
														labelClassName={labelClassName}
														checked={warrantyUnit === "days"}
														onChange={() => handleWarrantyUnitChange("days")}
													/>
												</div>

												<div className="flex h-12 items-center">
													<RadioButton
														id={`warranty-in-months-${field.id}`}
														name={warrantyRadioName}
														value="warrantyInMonths"
														label="Garantía en Meses"
														labelPosition="right"
														labelClassName={labelClassName}
														checked={warrantyUnit === "months"}
														onChange={() => handleWarrantyUnitChange("months")}
													/>
												</div>
											</>
										)
									}

								</div>

								<div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
									<Controller
										control={control}
										name={`${basePath}.quantity`}
										rules={{
											required: "La cantidad es requerida",
											validate: (value) => {
												const quantity = Number(value);
												if (value === null || value === undefined || Number.isNaN(quantity)) {
													return "Ingrese una cantidad válida";
												}
												if (quantity <= 0) {
													return "La cantidad debe ser mayor a 0";
												}
												return true;
											},
										}}
										render={({ field: quantityField, fieldState }) => (
											<InputText
												label="Cantidad"
												type="number"
												placeholder="0"
												className={inputClassName}
												labelClassName={labelClassName}
												value={quantityField.value ?? ""}
												onChange={(e) =>
													quantityField.onChange(toNumberValue(e.target.value))
												}
												error={fieldState.error?.message}
											/>
										)}
									/>

									<Controller
										control={control}
										name={`${basePath}.price`}
										rules={{
											required: "El precio unitario es requerido",
											validate: (value) => {
												const price = Number(value);
												if (value === null || value === undefined || Number.isNaN(price)) {
													return "Ingrese un precio válido";
												}
												if (price < 0) {
													return "El precio no puede ser negativo";
												}
												return true;
											},
										}}
										render={({ field: priceField, fieldState }) => (
											<InputText
												label="Precio Unitario"
												type="number"
												step="0.01"
												min="0"
												placeholder="0"
												className={inputClassName}
												labelClassName={labelClassName}
												value={priceField.value ?? ""}
												onChange={(e) =>
													priceField.onChange(toNumberValue(e.target.value))
												}
												error={fieldState.error?.message}
											/>
										)}
									/>

									<Controller
										control={control}
										name={`${basePath}.quantity_per_unit`}
										render={({ field: qtyPerUnitField, fieldState }) => (
											<InputText
												label="Cantidad por unidad"
												type="number"
												placeholder="0"
												className={inputClassName}
												labelClassName={labelClassName}
												value={qtyPerUnitField.value ?? ""}
												onChange={(e) =>
													qtyPerUnitField.onChange(toNumberValue(e.target.value))
												}
												error={fieldState.error?.message}
											/>
										)}
									/>

									{hasWarranty &&
										(warrantyUnit === "days" ? (
											<Controller
												control={control}
												name={`${warrantyPath}.quantity_days`}
												render={({ field: daysField }) => (
													<InputText
														label="Días de Garantía"
														type="number"
														min="0"
														placeholder="0"
														className={inputClassName}
														labelClassName={labelClassName}
														value={daysField.value ?? ""}
														onChange={(e) =>
															daysField.onChange(toNumberValue(e.target.value))
														}
													/>
												)}
											/>
										) : (
											<Controller
												control={control}
												name={`${warrantyPath}.quantity_months`}
												render={({ field: monthsField }) => (
													<InputText
														label="Meses de Garantía"
														type="number"
														min="0"
														placeholder="0"
														className={inputClassName}
														labelClassName={labelClassName}
														value={monthsField.value ?? ""}
														onChange={(e) =>
															monthsField.onChange(
																toNumberValue(e.target.value),
															)
														}
													/>
												)}
											/>
										))}
								</div>
							</div>
						);
					})}
				</div>
			</AccordionItem>

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				selectionType="multiple"
				excludeSupplierIds={fields.map((item) => item.supplier_id)}
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
