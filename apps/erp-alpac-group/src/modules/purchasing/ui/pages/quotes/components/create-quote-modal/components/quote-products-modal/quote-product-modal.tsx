import { useEffect, useMemo } from "react";
import {
	Controller,
	FormProvider,
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
import { SaveIcon, XIcon } from "lucide-react";
import {
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { TimeTypeOptions } from "@app/core/enums/time-type.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import type { QuotationItem } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type {
	QuotationItemFieldsProps,
	QuoteProductFormValues,
	QuoteProductModalProps,
} from "./quote-product-modal.types";

const emptyQuotationItem = (
	purchaseRequestItemId: string,
): QuotationItem => ({
	supplier_id: "",
	purchase_request_item_id: purchaseRequestItemId,
	has_delivery: false,
	has_guarantee: false,
	price: 0,
	price_total: 0,
	iva: undefined,
	price_unit: undefined,
	brand_product: "",
	delivery_time: undefined,
	delivery_time_type: undefined,
	warranty_period: undefined,
	warranty_period_time_type: undefined,
});

const resolvePurchaseRequestItemId = (
	product: PurchaseRequestProductInformation,
	index: number,
) =>
	product.purchase_request_item_id?.trim() ||
	product.product_details?.product_id?.trim() ||
	`product-${index}`;

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
	itemIndex,
	productName,
	categoryName,
	supplierOptions,
}: QuotationItemFieldsProps) {
	const {
		control,
		register,
		setValue,
		formState: { errors },
	} = useFormContext<QuoteProductFormValues>();

	const hasDelivery = useWatch({
		control,
		name: `items.${itemIndex}.has_delivery`,
	});
	const hasGuarantee = useWatch({
		control,
		name: `items.${itemIndex}.has_guarantee`,
	});

	const itemErrors = errors.items?.[itemIndex];

	return (
		<li className="flex flex-col gap-3 border-b border-slate-200 py-10 last:border-b-0 dark:border-neutral-600">
			<div className="flex min-w-0 items-baseline gap-2">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
					{itemIndex + 1}
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

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Controller
					control={control}
					name={`items.${itemIndex}.supplier_id`}
					rules={{ required: "Seleccione un proveedor." }}
					render={({ field }) => (
						<Dropdown
							label="Proveedor"
							placeholder="Seleccione un proveedor"
							appearance="dark"
							isRequired
							options={supplierOptions}
							value={field.value}
							onChange={(value) => field.onChange(String(value ?? ""))}
							labelClassName={quoteFormLabelClassName}
							valueClassName={quoteFormLabelClassName}
							className={quoteFormInputClassName}
							error={itemErrors?.supplier_id?.message}
						/>
					)}
				/>

				<InputText
					label="Marca"
					placeholder="Ej. Bosch"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`items.${itemIndex}.brand_product`)}
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
					{...register(`items.${itemIndex}.price`, {
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
					{...register(`items.${itemIndex}.price_unit`, {
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
					{...register(`items.${itemIndex}.iva`, {
						setValueAs: toNumberOrUndefined,
					})}
				/>

				<InputText
					label="Precio total"
					type="number"
					min="0"
					step="0.01"
					isRequired
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`items.${itemIndex}.price_total`, {
						required: "El precio total es requerido.",
						setValueAs: (value) => Number(value) || 0,
						validate: (value) =>
							Number(value) > 0 || "El precio total debe ser mayor a 0.",
					})}
					error={itemErrors?.price_total?.message}
				/>
			</div>

			<div className="flex flex-wrap gap-4">
				<Controller
					control={control}
					name={`items.${itemIndex}.has_delivery`}
					render={({ field }) => (
						<Checkbox
							label="Incluye entrega"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`items.${itemIndex}.delivery_time`, undefined);
									setValue(`items.${itemIndex}.delivery_time_type`, undefined);
								}
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`items.${itemIndex}.has_guarantee`}
					render={({ field }) => (
						<Checkbox
							label="Incluye garantía"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`items.${itemIndex}.warranty_period`, undefined);
									setValue(
										`items.${itemIndex}.warranty_period_time_type`,
										undefined,
									);
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
						{...register(`items.${itemIndex}.delivery_time`, {
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
						name={`items.${itemIndex}.delivery_time_type`}
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
						{...register(`items.${itemIndex}.warranty_period`, {
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
						name={`items.${itemIndex}.warranty_period_time_type`}
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
		</li>
	);
}

export function QuoteProductModal({
	isOpen,
	products,
	onClose,
	onConfirm,
}: QuoteProductModalProps) {
	const { companyId, moduleCode } = useUserStore();
	const productsCount = products.length;

	const methods = useForm<QuoteProductFormValues>({
		defaultValues: { items: [] },
		mode: "onSubmit",
	});

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	const { GetSuppliers } = useSupplier({
		suppliersFilters: {
			companie_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: 100,
		},
	});

	const supplierOptions = useMemo(() => {
		const suppliers = GetSuppliers.data?.data ?? [];
		return suppliers.map((supplier) => ({
			value: supplier.supplier_id,
			label: supplier.supplier_legal_name,
		}));
	}, [GetSuppliers.data?.data]);

	useEffect(() => {
		if (!isOpen) {
			reset({ items: [] });
			return;
		}

		reset({
			items: products.map((product, index) =>
				emptyQuotationItem(resolvePurchaseRequestItemId(product, index)),
			),
		});
	}, [isOpen, products, reset]);

	const handleClose = () => {
		reset({ items: [] });
		onClose();
	};

	const onSubmit = (values: QuoteProductFormValues) => {
		console.log("Datos para el servidor al crear cotización:", values)
		onConfirm?.(values.items);
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
					? `Complete la información de cotización para ${productsCount} producto${productsCount === 1 ? "" : "s"} seleccionado${productsCount === 1 ? "" : "s"}.`
					: "Complete la información de cotización de los productos seleccionados."
			}
			panelClassName={[
				"flex h-[min(94dvh,48rem)] w-[min(calc(100vw-1rem),52rem)] min-w-0 flex-col overflow-hidden",
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
										{products.map((product, index) => {
											const productName =
												product.product_details?.product_name?.trim() ||
												"Producto sin nombre";
											const categoryName =
												product.product_details?.category_information?.name?.trim();

											return (
												<QuotationItemFields
													key={resolvePurchaseRequestItemId(product, index)}
													itemIndex={index}
													productName={productName}
													categoryName={categoryName}
													supplierOptions={supplierOptions}
												/>
											);
										})}
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
