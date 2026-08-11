import { useEffect, useState } from "react";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";
import {
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";
import { PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
import {
	quoteFormDangerButtonClassName,
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { TimeTypeOptions } from "@app/core/enums/time-type.enum";
import type { QuotationItem } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { SelectSupplierModal } from "../select-supplier-modal/select-supplier-modal";
import type {
	QuotationItemFieldsProps,
	QuotationItemForm,
	QuoteProductFormValues,
	QuoteProductGroupFieldsProps,
	QuoteProductModalProps,
} from "./quote-product-modal.types";
import { MIN_SUPPLIERS_PER_PRODUCT } from "./quote-product-modal.types";

const emptyQuotationItem = (
	purchaseRequestItemId: string,
	supplier?: Pick<GetSuppliersResponse, "supplier_id" | "supplier_legal_name">,
): QuotationItemForm => ({
	supplier_id: supplier?.supplier_id ?? "",
	supplier_legal_name: supplier?.supplier_legal_name ?? "",
	purchase_request_item_id: purchaseRequestItemId,
	has_delivery: false,
	has_guarantee: false,
	price: 0,	
	iva: undefined,
	price_unit: undefined,
	brand_product: "",
	delivery_time: undefined,
	delivery_time_type: undefined,
	warranty_period: undefined,
	warranty_period_time_type: undefined,
});

const toNumberOrUndefined = (value: unknown) => {
	if (value === "" || value === null || value === undefined) return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
};

const timeTypeOptions = TimeTypeOptions.map((option) => ({
	value: String(option.value),
	label: option.label,
}));

function QuotationItemFields({
	productIndex,
	itemIndex,
	canRemove,
	supplierLegalName,
	onRemove,
}: QuotationItemFieldsProps) {
	const {
		control,
		register,
		setValue,
		formState: { errors },
	} = useFormContext<QuoteProductFormValues>();

	const hasDelivery = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.has_delivery`,
	});
	const hasGuarantee = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.has_guarantee`,
	});

	const itemErrors = errors.products?.[productIndex]?.items?.[itemIndex];
	const fieldPath = `products.${productIndex}.items.${itemIndex}` as const;

	return (
		<div className="flex flex-col gap-3 rounded-md border border-slate-200 p-4 dark:border-neutral-600 dark:bg-[#1e2229]">
			<div className="flex items-center justify-between gap-3">
				<span className="min-w-0 truncate text-[14px] font-semibold text-slate-700 dark:text-slate-200">
					Cotización · {supplierLegalName || `Proveedor ${itemIndex + 1}`}
				</span>
				{canRemove ? (
					<Button
						type="button"
						size="small"
						tooltip="Eliminar proveedor"
						icon={<Trash2Icon size={18} />}
						onClick={onRemove}
						className={`${quoteFormDangerButtonClassName} h-10 w-10!`}
					/>
				) : null}
			</div>

			<input
				type="hidden"
				{...register(`${fieldPath}.supplier_id`, {
					required: "Debe seleccionar un proveedor.",
				})}
			/>
			<input type="hidden" {...register(`${fieldPath}.supplier_legal_name`)} />
			<input
				type="hidden"
				{...register(`${fieldPath}.purchase_request_item_id`)}
			/>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<InputText
					label="Proveedor"
					value={supplierLegalName}
					disabled
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
				/>

				<InputText
					label="Marca"
					placeholder="Ej. Bosch"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.brand_product`)}
				/>

				<InputText
					label="Precio"
					type="number"
					min="0"
					step="0.01"
					isRequired
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.price`, {
						required: "El precio es requerido.",
						setValueAs: (value) => Number(value) || 0,
						validate: (value) =>
							Number(value) > 0 || "El precio debe ser mayor a 0.",
					})}
					error={itemErrors?.price?.message}
				/>

				<InputText
					label="Precio unitario"
					type="number"
					min="0"
					step="0.01"
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.price_unit`, {
						setValueAs: toNumberOrUndefined,
					})}
				/>

				<InputText
					label="IVA"
					type="number"
					min="0"
					step="0.01"
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.iva`, {
						setValueAs: toNumberOrUndefined,
					})}
				/>				

			</div>

			<div className="flex flex-wrap gap-4">
				<Controller
					control={control}
					name={`${fieldPath}.has_delivery`}
					render={({ field }) => (
						<Checkbox
							label="Incluye entrega"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`${fieldPath}.delivery_time`, undefined);
									setValue(`${fieldPath}.delivery_time_type`, undefined);
								}
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.has_guarantee`}
					render={({ field }) => (
						<Checkbox
							label="Incluye garantía"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`${fieldPath}.warranty_period`, undefined);
									setValue(`${fieldPath}.warranty_period_time_type`, undefined);
								}
							}}
						/>
					)}
				/>
			</div>

			{hasDelivery ? (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<InputText
						label="Tiempo de entrega"
						type="number"
						min="0"
						isRequired
						placeholder="Ej. 5"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.delivery_time`, {
							required: hasDelivery
								? "El tiempo de entrega es requerido."
								: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								!hasDelivery ||
								(value != null && Number(value) > 0) ||
								"El tiempo de entrega debe ser mayor a 0.",
						})}
						error={itemErrors?.delivery_time?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.delivery_time_type`}
						rules={{
							validate: (value) =>
								!hasDelivery ||
								(value != null && Number(value) > 0) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={timeTypeOptions}
								value={field.value != null ? String(field.value) : ""}
								onChange={(value) =>
									field.onChange(value ? Number(value) : undefined)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.delivery_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}

			{hasGuarantee ? (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<InputText
						label="Periodo de garantía"
						type="number"
						min="0"
						isRequired
						placeholder="Ej. 12"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.warranty_period`, {
							required: hasGuarantee
								? "El periodo de garantía es requerido."
								: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								!hasGuarantee ||
								(value != null && Number(value) > 0) ||
								"El periodo de garantía debe ser mayor a 0.",
						})}
						error={itemErrors?.warranty_period?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.warranty_period_time_type`}
						rules={{
							validate: (value) =>
								!hasGuarantee ||
								(value != null && Number(value) > 0) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={timeTypeOptions}
								value={field.value != null ? String(field.value) : ""}
								onChange={(value) =>
									field.onChange(value ? Number(value) : undefined)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.warranty_period_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}
		</div>
	);
}

function QuoteProductGroupFields({
	productIndex,
	productName,
	categoryName,
}: QuoteProductGroupFieldsProps) {
	const {
		control,
		formState: { errors },
	} = useFormContext<QuoteProductFormValues>();

	const purchaseRequestItemId = useWatch({
		control,
		name: `products.${productIndex}.purchase_request_item_id`,
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: `products.${productIndex}.items`,
		rules: {
			validate: (items) => {
				if (!items || items.length < MIN_SUPPLIERS_PER_PRODUCT) {
					return `Cada producto debe tener al menos ${MIN_SUPPLIERS_PER_PRODUCT} proveedores. Use "Agregar Proveedor" para seleccionarlos.`;
				}

				const supplierIds = items
					.map((item) => item.supplier_id?.trim())
					.filter(Boolean);
				const uniqueIds = new Set(supplierIds);

				if (uniqueIds.size < supplierIds.length) {
					return "No puede repetir el mismo proveedor en un producto.";
				}

				return true;
			},
		},
	});

	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);

	const excludeSupplierIds = fields
		.map((field) => field.supplier_id)
		.filter(Boolean);

	const groupError =
		errors.products?.[productIndex]?.items?.root?.message ??
		errors.products?.[productIndex]?.items?.message;

	const handleSelectSuppliers = (suppliers: GetSuppliersResponse[]) => {
		const existingIds = new Set(
			fields.map((field) => field.supplier_id).filter(Boolean),
		);

		const suppliersToAdd = suppliers.filter(
			(supplier) => !existingIds.has(supplier.supplier_id),
		);

		if (suppliersToAdd.length === 0) return;

		append(
			suppliersToAdd.map((supplier) =>
				emptyQuotationItem(purchaseRequestItemId || "", supplier),
			),
		);
	};

	return (
		<li className="flex flex-col gap-4 border-b border-slate-200 py-10 last:border-b-0 dark:border-neutral-600">
			<div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
						{productIndex + 1}
					</span>
					<span className="min-w-0 truncate text-[16px] font-medium text-slate-800 dark:text-white">
						{productName}
						{categoryName ? (
							<span className="font-normal text-slate-500 dark:text-slate-400">
								{" "}
								· {categoryName}
							</span>
						) : null}
					</span>
				</div>

				<Button
					type="button"
					label="Agregar Proveedor"
					size="giant"
					onClick={() => setIsSelectSupplierOpen(true)}
					isHiddenLabelOnMobile
					icon={<PlusIcon size={20} />}
					className={quoteFormPrimaryButtonClassName}
				/>
			</div>

			<p className="m-0 text-[13px] text-slate-500 dark:text-slate-400">
				Busque y seleccione proveedores con el botón. Mínimo{" "}
				{MIN_SUPPLIERS_PER_PRODUCT} por producto.
			</p>

			{groupError ? (
				<p className="m-0 text-[13px] text-red-500">{groupError}</p>
			) : null}

			{fields.length === 0 ? (
				<p className="m-0 rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-neutral-600 dark:text-slate-400">
					Aún no hay proveedores. Use &quot;Agregar Proveedor&quot; para
					buscarlos y seleccionarlos.
				</p>
			) : (
				<div className="flex flex-col gap-3">
					{fields.map((field, itemIndex) => (
						<QuotationItemFields
							key={field.id}
							productIndex={productIndex}
							itemIndex={itemIndex}
							canRemove
							supplierLegalName={field.supplier_legal_name || ""}
							onRemove={() => remove(itemIndex)}
						/>
					))}
				</div>
			)}

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				selectionType="multiple"
				excludeSupplierIds={excludeSupplierIds}
				onSelect={handleSelectSuppliers}
			/>
		</li>
	);
}

export function QuoteProductModal({
	isOpen,
	products,
	onClose,
	onConfirm,
}: QuoteProductModalProps) {

	const productsCount = products.length;	

	const methods = useForm<QuoteProductFormValues>({
		defaultValues: { products: [] },
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	const { fields: productFields } = useFieldArray({
		control,
		name: "products",
	});

	useEffect(() => {
		if (!isOpen) {
			reset({ products: [] });
			return;
		}

		reset({
			products: products.map((product) => {

				const purchaseRequestItemId = product?.purchase_request_id ?? "";

				return {
					purchase_request_item_id: purchaseRequestItemId,
					product_name:
						product.product_details?.product_name?.trim() ||
						"Producto sin nombre",
					category_name:
						product.product_details?.category_information?.name?.trim() ||
						null,
					items: [],
				};
			}),
		});
	}, [isOpen, products, reset]);

	const handleClose = () => {
		reset({ products: [] });
		onClose();
	};

	const onSubmit = (values: QuoteProductFormValues) => {

		const invalidProduct = values.products.find(
			(product) => product.items.length < MIN_SUPPLIERS_PER_PRODUCT,
		);

		if (invalidProduct) return;

		const items: QuotationItem[] = values.products.flatMap((product) =>
			product.items.map(
				({ supplier_legal_name: _supplierLegalName, ...item }) => ({
					...item,
					purchase_request_item_id: product.purchase_request_item_id,
				}),
			),
		);
		
		onConfirm?.(items);
		
		handleClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="7xl"
			title="Cotizar productos"
			description={
				productsCount > 0
					? `Complete la cotización para ${productsCount} producto${productsCount === 1 ? "" : "s"}. Use "Agregar Proveedor" para buscar y seleccionar al menos ${MIN_SUPPLIERS_PER_PRODUCT} proveedores por producto.`
					: "Complete la información de cotización de los productos seleccionados."
			}			
			panelClassName={[				
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col gap-2">
							{productsCount === 0 ? (
								<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
									No hay productos seleccionados para cotizar.
								</p>
							) : (
								<section className="flex flex-col gap-1">
									<ul className="m-0 list-none p-0">
										{productFields.map((field, index) => (
											<QuoteProductGroupFields
												key={field.id}
												productIndex={index}
												productName={field.product_name}
												categoryName={field.category_name}
											/>
										))}
									</ul>
								</section>
							)}
						</div>
					</div>

					<div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
							<Button
								type="button"
								label="Cancelar"
								size="giant"
								disabled={isSubmitting}
								onClick={handleClose}
								isHiddenLabelOnMobile
								icon={<XIcon size={20} />}
								className={quoteFormSecondaryButtonClassName}
							/>
							<Button
								type="submit"
								label="Confirmar cotización"
								size="giant"
								disabled={productsCount === 0 || isSubmitting}
								isLoading={isSubmitting}
								isHiddenLabelOnMobile
								icon={<SaveIcon size={20} />}
								className={quoteFormPrimaryButtonClassName}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Modal>
	);
}
