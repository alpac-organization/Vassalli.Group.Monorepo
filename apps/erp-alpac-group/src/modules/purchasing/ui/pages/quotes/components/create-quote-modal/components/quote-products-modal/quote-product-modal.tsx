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
	AccordionGroup,
	AccordionItem,
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { CircleAlert, PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
import {
	quoteFormDangerButtonClassName,
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { TimeTypeEnum, TimeTypeOptions } from "@app/core/enums/time-type.enum";
import type { TimeTypeValue } from "@app/core/enums/time-type.enum";
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import {
	ProductQualityEnum,
	ProductQualityOptions,
} from "@app/modules/purchasing/domain/enums/product-quality";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
import type {
	GetSuppliersResponse,
	SupplierPaymentMethod,
} from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import { httpHandler } from "@app/core/adapters";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SelectSupplierModal } from "../select-supplier-modal/select-supplier-modal";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import { QuotationPdfUploader } from "../quotation-pdf-uploader/quotation-pdf-uploader";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type {
	DraftQuotationItem,
	QuotationItemFieldsProps,
	QuotationItemForm,
	QuoteProductFormValues,
	QuoteProductGroupFieldsProps,
	QuoteProductModalProps,
} from "./quote-product-modal.types";
import { MIN_SUPPLIERS_PER_PRODUCT } from "./quote-product-modal.types";

const supplierServices = new SupplierServices(httpHandler);

const paymentMethodEntries = Object.values(PaymentMethodEnum);

const productQualityOptions = ProductQualityOptions.map((option) => ({
	value: option.textValue,
	label: option.label,
}));

const deliveryTimeOptions = TimeTypeOptions.filter(
	(option) => option.value !== TimeTypeEnum.Years.stringValue,
);

const timeTypeOptions = TimeTypeOptions;

const normalizePaymentMethodType = (
	raw: unknown,
): PaymentMethodType | undefined => {
	if (raw == null || raw === "") return undefined;

	if (typeof raw === "number") {
		return paymentMethodEntries.find((e) => e.value === raw)?.stringValue;
	}

	if (typeof raw === "string") {
		const byString = paymentMethodEntries.find(
			(e) =>
				e.stringValue === raw ||
				e.stringValue.toLowerCase() === raw.toLowerCase(),
		);
		if (byString) return byString.stringValue;

		const asNumber = Number(raw);
		if (!Number.isNaN(asNumber)) {
			return paymentMethodEntries.find((e) => e.value === asNumber)?.stringValue;
		}
	}

	return undefined;
};

const resolvePaymentMethodLabel = (
	method?: PaymentMethodType | number | null,
): string => {
	if (method == null) return "—";
	const normalized = normalizePaymentMethodType(method);
	if (!normalized) return String(method);
	const entry = paymentMethodEntries.find((e) => e.stringValue === normalized);
	return entry?.label ?? normalized;
};

const getMethodValue = (
	method?: SupplierPaymentMethod | Record<string, unknown>,
): PaymentMethodType | undefined => {
	if (!method) return undefined;
	const raw = method as Record<string, unknown>;
	return normalizePaymentMethodType(
		raw.payment_method_type ??
			raw.payment_method ??
			raw.paymentmethodtype ??
			raw.paymentMethodType ??
			raw.PaymentMethodType,
	);
};

const isPaymentMethodActive = (
	method?: SupplierPaymentMethod | Record<string, unknown>,
): boolean => {
	if (!method) return false;
	const raw = method as Record<string, unknown>;
	if (raw.is_active === false || raw.isActive === false) return false;
	return true;
};

const normalizePaymentMethods = (
	methods?: unknown,
): SupplierPaymentMethod[] => {
	if (!Array.isArray(methods)) return [];

	return methods
		.map((item): SupplierPaymentMethod | null => {
			const raw = (item ?? {}) as Record<string, unknown>;
			const payment_method_type = getMethodValue(raw);
			if (!payment_method_type) return null;

			const normalized: SupplierPaymentMethod = {
				is_active: isPaymentMethodActive(raw),
				payment_method_type,
			};

			if (typeof raw.notes === "string") {
				normalized.notes = raw.notes;
			}

			return normalized;
		})
		.filter((item): item is SupplierPaymentMethod => item != null);
};

const getActivePaymentMethods = (methods?: SupplierPaymentMethod[]) =>
	normalizePaymentMethods(methods).filter(
		(m) => m.is_active !== false && m.payment_method_type != null,
	);

const buildPaymentMethodOptions = (methods: SupplierPaymentMethod[]) =>
	getActivePaymentMethods(methods).map((m) => ({
		value: m.payment_method_type!,
		label: resolvePaymentMethodLabel(m.payment_method_type),
	}));

const normalizeTimeTypeValue = (raw: unknown): TimeTypeValue | undefined => {
	if (raw == null || raw === "") return undefined;
	if (typeof raw === "string") {
		const match = Object.values(TimeTypeEnum).find(
			(option) =>
				option.stringValue === raw ||
				option.stringValue.toLowerCase() === raw.toLowerCase() ||
				option.stringValue.toLowerCase().startsWith(raw.toLowerCase()),
		);
		return match?.stringValue;
	}
	if (typeof raw === "number") {
		return Object.values(TimeTypeEnum).find((option) => option.value === raw)
			?.stringValue;
	}
	return undefined;
};

const toNumberOrUndefined = (value: unknown) => {
	if (value === "" || value === null || value === undefined) return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
};

const toDataUrlImages = (images?: ImageOutput[]): string[] =>
	(images ?? [])
		.map((image) => {
			if (image.base64.startsWith("data:")) return image.base64;
			const contentType = image.contentType || "image/jpeg";
			return `data:${contentType};base64,${image.base64}`;
		})
		.slice(0, 2);

const emptyQuotationItem = (
	purchaseRequestItemId: string,
	supplier?: Pick<GetSuppliersResponse, "supplier_id" | "supplier_legal_name">,
	paymentMethods?: unknown,
	preferredPayment?: unknown,
): QuotationItemForm => {
	const normalizedMethods = normalizePaymentMethods(paymentMethods);
	const preferred = normalizePaymentMethodType(preferredPayment);
	const active = getActivePaymentMethods(normalizedMethods);
	let autoPayment: PaymentMethodType | undefined;

	if (active.length === 1) {
		autoPayment = active[0].payment_method_type;
	} else if (
		preferred &&
		active.some((m) => m.payment_method_type === preferred)
	) {
		autoPayment = preferred;
	}

	return {
		supplier_id: supplier?.supplier_id ?? "",
		supplier_legal_name: supplier?.supplier_legal_name ?? "",
		purchase_request_item_id: purchaseRequestItemId,
		has_delivery: false,
		has_guarantee: false,
		inventory_available: true,
		brand_product: "",
		product_quality: ProductQualityEnum.Good.textValue,
		payment_method: autoPayment,
		delivery_time: undefined,
		availability_time: undefined,
		availability_time_type: undefined,
		supplier_selection_justification: "",
		delivery_time_type: undefined,
		warranty_period: undefined,
		warranty_period_time_type: undefined,
		supplier_payment_methods: normalizedMethods,
		preferred_payment_method: preferred,
		attachments_form: {
			pdf_base64: null,
			pdf_file_name: null,
			images: [],
		},
	};
};

const mapDraftItemToForm = (item: DraftQuotationItem): QuotationItemForm => {
	const { payment_method_type, attachments, ...rest } = item;
	return {
		...rest,
		inventory_available: item.inventory_available !== false,
		product_quality: item.product_quality ?? ProductQualityEnum.Good.textValue,
		payment_method: normalizePaymentMethodType(payment_method_type),
		availability_time_type: normalizeTimeTypeValue(item.availability_time_type),
		delivery_time_type: normalizeTimeTypeValue(item.delivery_time_type),
		warranty_period_time_type: normalizeTimeTypeValue(
			item.warranty_period_time_type,
		),
		attachments_form: {
			pdf_base64: attachments?.pdf_base64 ?? null,
			pdf_file_name: attachments?.pdf_file_name ?? null,
			images: [],
		},
	};
};

const buildInitialQuotationItems = (
	product: PurchaseRequestProductInformation,
	existingItems: DraftQuotationItem[],
): QuotationItemForm[] => {
	const productId = product.product_details?.product_id ?? "";
	const purchaseRequestItemId = product.purchase_request_item_id ?? "";

	const draftItems = existingItems.filter(
		(item) =>
			item.product_id === productId ||
			(purchaseRequestItemId &&
				item.purchase_request_item_id === purchaseRequestItemId),
	);

	if (draftItems.length > 0) {
		return draftItems.map(mapDraftItemToForm);
	}

	const linkedSuppliers = product.product_details?.supplier_products ?? [];
	const seenSupplierIds = new Set<string>();

	return linkedSuppliers.flatMap((supplierProduct) => {
		const supplierId = supplierProduct.supplier_id?.trim();
		if (!supplierId || seenSupplierIds.has(supplierId)) return [];

		seenSupplierIds.add(supplierId);

		const legalName =
			supplierProduct.suppliers_legal_name?.trim() ||
			supplierProduct.commercial_name?.trim() ||
			"";

		return [
			emptyQuotationItem(purchaseRequestItemId, {
				supplier_id: supplierId,
				supplier_legal_name: legalName,
			}),
		];
	});
};

const conditionalFieldsGridClassName =
	"mt-4 grid grid-cols-1 gap-4 md:grid-cols-2";

function QuotationItemFields({
	productIndex,
	itemIndex,
	accordionValue,
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
	const inventoryAvailable = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.inventory_available`,
	});
	const supplierPaymentMethods = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.supplier_payment_methods`,
	});
	const preferredPaymentMethod = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.preferred_payment_method`,
	});
	const attachmentsForm = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.attachments_form`,
	});

	const itemErrors = errors.products?.[productIndex]?.items?.[itemIndex];
	const fieldPath = `products.${productIndex}.items.${itemIndex}` as const;
	const supplierLabel = supplierLegalName || `Proveedor ${itemIndex + 1}`;

	const activePaymentMethods = getActivePaymentMethods(supplierPaymentMethods);
	const paymentMethodOptions = buildPaymentMethodOptions(
		supplierPaymentMethods ?? [],
	);
	const hasSinglePaymentMethod = activePaymentMethods.length === 1;
	const preferredPaymentNormalized =
		normalizePaymentMethodType(preferredPaymentMethod);
	const hasNoPaymentMethods = activePaymentMethods.length === 0;
	const lockedPaymentMethod = hasSinglePaymentMethod
		? activePaymentMethods[0].payment_method_type
		: undefined;

	useEffect(() => {
		if (!lockedPaymentMethod) return;
		setValue(`${fieldPath}.payment_method`, lockedPaymentMethod, {
			shouldValidate: true,
		});
	}, [fieldPath, lockedPaymentMethod, setValue]);

	return (
		<AccordionItem
			value={accordionValue}
			className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
			contentClassName="p-4"
			title={
				<div className="flex min-w-0 flex-1 items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{itemIndex + 1}
						</span>
						<span className="min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white">
							Cotización · {supplierLabel}
						</span>
					</div>
					{canRemove ? (
						<span
							className="flex shrink-0 items-center"
							onClick={(evt) => evt.stopPropagation()}
							onKeyDown={(evt) => evt.stopPropagation()}
						>
							<Button
								type="button"
								size="small"
								tooltip="Eliminar proveedor"
								icon={<Trash2Icon size={18} />}
								onClick={onRemove}
								className={`${quoteFormDangerButtonClassName} h-10 w-10!`}
							/>
						</span>
					) : null}
				</div>
			}
		>
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

				<Controller
					control={control}
					name={`${fieldPath}.product_quality`}
					rules={{
						required: "La calidad del producto es requerida.",
					}}
					render={({ field }) => (
						<Dropdown
							label="Calidad del producto"
							placeholder="Seleccione"
							appearance="dark"
							isRequired
							options={productQualityOptions}
							value={field.value ?? ""}
							onChange={(value) =>
								field.onChange((value || undefined) as ProductQualityType | undefined)
							}
							labelClassName={quoteFormLabelClassName}
							valueClassName={quoteFormLabelClassName}
							className={quoteFormInputClassName}
							error={itemErrors?.product_quality?.message}
						/>
					)}
				/>
			</div>

			<p className="mt-3 m-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-600 dark:border-neutral-600 dark:bg-[#1e2229] dark:text-slate-300">
				El precio unitario, IVA y totales los calcula el sistema según el
				catálogo del proveedor (precio base o preferencial por cantidad).
			</p>

			<div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:gap-4 dark:border-neutral-600">
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

				<Controller
					control={control}
					name={`${fieldPath}.inventory_available`}
					render={({ field }) => (
						<Checkbox
							label="¿Inventario disponible?"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (checked) {
									setValue(`${fieldPath}.availability_time`, undefined);
									setValue(`${fieldPath}.availability_time_type`, undefined);
								}
							}}
						/>
					)}
				/>
			</div>

			{inventoryAvailable === false ? (
				<div className={conditionalFieldsGridClassName}>
					<InputText
						label="Tiempo de disponibilidad"
						type="number"
						min="0"
						isRequired
						placeholder="Ej. 5"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.availability_time`, {
							required:
								inventoryAvailable === false
									? "El tiempo de disponibilidad es requerido."
									: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								inventoryAvailable !== false ||
								(value != null && Number(value) > 0) ||
								"El tiempo de disponibilidad debe ser mayor a 0.",
						})}
						error={itemErrors?.availability_time?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.availability_time_type`}
						rules={{
							validate: (value) =>
								inventoryAvailable !== false ||
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={timeTypeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.availability_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}

			{hasDelivery ? (
				<div className={conditionalFieldsGridClassName}>
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
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={deliveryTimeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
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
				<div className={conditionalFieldsGridClassName}>
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
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={timeTypeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
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

			<div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-neutral-600">
				{preferredPaymentNormalized ? (
					<div className="flex flex-col gap-1">
						<span
							className={`text-[13px] font-medium ${quoteFormLabelClassName}`}
						>
							Método de pago preferido
						</span>
						<span className="text-sm text-slate-600 dark:text-slate-300">
							{resolvePaymentMethodLabel(preferredPaymentNormalized)}
						</span>
					</div>
				) : null}

				{hasNoPaymentMethods ? (
					<>
						<div
							role="alert"
							className="flex w-full items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5"
						>
							<CircleAlert
								size={18}
								className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
								aria-hidden
							/>
							<p className="m-0 text-[13px] text-amber-800 dark:text-amber-200">
								El proveedor no tiene métodos de pago configurados. Configure al
								menos uno en el catálogo de proveedores.
							</p>
						</div>
						<Controller
							control={control}
							name={`${fieldPath}.payment_method`}
							rules={{
								validate: () =>
									"El proveedor debe tener al menos un método de pago configurado.",
							}}
							render={() => <input type="hidden" />}
						/>
						{itemErrors?.payment_method?.message ? (
							<p className="m-0 text-[13px] text-red-500">
								{itemErrors.payment_method.message}
							</p>
						) : null}
					</>
				) : lockedPaymentMethod ? (
					<div className="flex flex-col gap-1">
						<span
							className={`text-[13px] font-medium ${quoteFormLabelClassName}`}
						>
							Método de pago
						</span>
						<span className="text-sm text-slate-600 dark:text-slate-300">
							{resolvePaymentMethodLabel(lockedPaymentMethod)}
							{" "}
							(asignado automáticamente)
						</span>
						<input
							type="hidden"
							{...register(`${fieldPath}.payment_method`)}
						/>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Controller
							control={control}
							name={`${fieldPath}.payment_method`}
							rules={{
								required: "Seleccione un método de pago.",
							}}
							render={({ field }) => (
								<Dropdown
									label="Método de pago"
									placeholder="Seleccione"
									appearance="dark"
									isRequired
									options={paymentMethodOptions}
									value={field.value ?? ""}
									onChange={(value) => field.onChange(value || undefined)}
									labelClassName={quoteFormLabelClassName}
									valueClassName={quoteFormLabelClassName}
									className={quoteFormInputClassName}
									error={itemErrors?.payment_method?.message}
								/>
							)}
						/>
					</div>
				)}
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 dark:border-neutral-600 md:grid-cols-2">
				<Controller
					control={control}
					name={`${fieldPath}.attachments_form.images`}
					render={({ field }) => (
						<ImageUploader
							label="Imágenes de la cotización"
							description="Máximo 2 imágenes (5 MB c/u)."
							maxFiles={2}
							maxSizeMB={5}
							value={field.value ?? []}
							onChange={(images) => field.onChange(images)}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.attachments_form`}
					render={({ field }) => (
						<QuotationPdfUploader
							fileName={attachmentsForm?.pdf_file_name}
							onChange={(next) =>
								field.onChange({
									...(field.value ?? {}),
									...next,
								})
							}
						/>
					)}
				/>
			</div>

			<div className="mt-4 border-t border-slate-200 pt-4 dark:border-neutral-600">
				<Controller
					control={control}
					name={`${fieldPath}.supplier_selection_justification`}
					rules={{
						required: "La justificación de selección es requerida.",
						validate: (value) => {
							const trimmed = value?.trim() ?? "";
							if (!trimmed) {
								return "La justificación de selección es requerida.";
							}
							if (trimmed.length < 10) {
								return "La justificación debe tener al menos 10 caracteres.";
							}
							return true;
						},
					}}
					render={({ field }) => (
						<Textarea
							label="Justificación de selección"
							isRequired
							placeholder="Ej. Mejor precio, tiempo de entrega y disponibilidad del producto."
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
							value={field.value ?? ""}
							onChange={field.onChange}
							enableCharacterCount
							error={itemErrors?.supplier_selection_justification?.message}
						/>
					)}
				/>
			</div>
		</AccordionItem>
	);
}

function QuoteProductGroupFields({
	productIndex,
	productName,
	categoryName,
}: QuoteProductGroupFieldsProps) {
	const { companyId, moduleCode } = useUserStore();
	const {
		control,
		register,
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
					return `Cada producto debe tener al menos ${MIN_SUPPLIERS_PER_PRODUCT} proveedores. Complete los vinculados o use "Agregar Proveedor" para incluir adicionales.`;
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
	const [isFetchingDetails, setIsFetchingDetails] = useState(false);
	const [openQuotations, setOpenQuotations] = useState<string[]>([]);

	const excludeSupplierIds = fields
		.map((field) => field.supplier_id)
		.filter(Boolean);

	useEffect(() => {
		setOpenQuotations(fields.map((field) => field.id));
	}, [fields]);

	const groupError =
		errors.products?.[productIndex]?.items?.root?.message ??
		errors.products?.[productIndex]?.items?.message;

	const handleSelectSuppliers = async (suppliers: GetSuppliersResponse[]) => {
		const existingIds = new Set(
			fields.map((field) => field.supplier_id).filter(Boolean),
		);

		const suppliersToAdd = suppliers.filter(
			(supplier) => !existingIds.has(supplier.supplier_id),
		);

		if (suppliersToAdd.length === 0) return;

		setIsFetchingDetails(true);

		try {
			const detailsResults = await Promise.all(
				suppliersToAdd.map((supplier) =>
					supplierServices
						.GetSupplierDetails({
							company_id: companyId,
							module_code: moduleCode,
							supplier_id: supplier.supplier_id,
						})
						.catch(() => null),
				),
			);

			const items = suppliersToAdd.map((supplier, idx) => {
				const details = detailsResults[idx];
				const paymentMethods =
					details?.supplier_payment_methods ??
					supplier.supplier_payment_methods ??
					[];
				const preferred = paymentMethods.find(
					(method) =>
						method.is_active !== false && method.payment_method_type,
				)?.payment_method_type;

				return emptyQuotationItem(
					purchaseRequestItemId || "",
					supplier,
					paymentMethods,
					preferred,
				);
			});

			append(items);
		} finally {
			setIsFetchingDetails(false);
		}
	};

	return (
		<li className="flex flex-col gap-4 border-b border-slate-200 py-10 last:border-b-0 dark:border-neutral-600">
			<input
				type="hidden"
				{...register(`products.${productIndex}.product_id`)}
			/>
			<input
				type="hidden"
				{...register(`products.${productIndex}.purchase_request_item_id`)}
			/>
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
					disabled={isFetchingDetails}
					isLoading={isFetchingDetails}
					onClick={() => setIsSelectSupplierOpen(true)}
					isHiddenLabelOnMobile
					icon={<PlusIcon size={20} />}
					className={quoteFormPrimaryButtonClassName}
				/>
			</div>

			<p className="m-0 text-[13px] text-slate-500 dark:text-slate-400">
				Los proveedores vinculados al producto se precargan automáticamente.
				Use &quot;Agregar Proveedor&quot; solo para incluir adicionales. Mínimo{" "}
				{MIN_SUPPLIERS_PER_PRODUCT} por producto.
			</p>

			{groupError ? (
				<p className="m-0 text-[13px] text-red-500">{groupError}</p>
			) : null}

			{fields.length === 0 ? (
				<p className="m-0 rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-neutral-600 dark:text-slate-400">
					Este producto no tiene proveedores vinculados. Use &quot;Agregar
					Proveedor&quot; para buscarlos y seleccionarlos.
				</p>
			) : (
				<AccordionGroup
					type="multiple"
					value={openQuotations}
					onValueChange={(value) => {
						const nextValue = Array.isArray(value)
							? value
							: value
								? [value]
								: [];
						setOpenQuotations(nextValue);
					}}
					className="gap-3"
				>
					{fields.map((field, itemIndex) => (
						<QuotationItemFields
							key={field.id}
							productIndex={productIndex}
							itemIndex={itemIndex}
							accordionValue={field.id}
							canRemove
							supplierLegalName={field.supplier_legal_name || ""}
							onRemove={() => remove(itemIndex)}
						/>
					))}
				</AccordionGroup>
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
	existingItems = [],
	onClose,
	onConfirm,
}: QuoteProductModalProps) {
	const { companyId, moduleCode } = useUserStore();
	const productsCount = products.length;

	const methods = useForm<QuoteProductFormValues>({
		defaultValues: { products: [] },
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		getValues,
		formState: { isSubmitting },
	} = methods;

	const { fields: productFields } = useFieldArray({
		control,
		name: "products",
	});

	const [isEnrichingPaymentMethods, setIsEnrichingPaymentMethods] =
		useState(false);

	useEffect(() => {
		if (!isOpen) {
			reset({ products: [] });
			setIsEnrichingPaymentMethods(false);
			return;
		}

		const nextProducts = products.map((product) => {
			const productId = product.product_details?.product_id ?? "";
			const purchaseRequestItemId = product.purchase_request_item_id ?? "";

			return {
				product_id: productId,
				purchase_request_item_id: purchaseRequestItemId,
				product_name:
					product.product_details?.product_name?.trim() ||
					"Producto sin nombre",
				category_name:
					product.product_details?.category_information?.name?.trim() || null,
				quantity: product.quantity,
				items: buildInitialQuotationItems(product, existingItems),
			};
		});

		reset({ products: nextProducts });

		const suppliersToEnrich = nextProducts.flatMap((product, productIndex) => {
			const hadSessionDraft = existingItems.some(
				(item) =>
					item.product_id === product.product_id ||
					(product.purchase_request_item_id &&
						item.purchase_request_item_id === product.purchase_request_item_id),
			);

			// Solo enriquecer seeds del catálogo; no pisar borradores de sesión.
			if (hadSessionDraft) return [];

			return product.items.flatMap((item, itemIndex) => {
				const supplierId = item.supplier_id?.trim();
				const hasPaymentMethods =
					(item.supplier_payment_methods?.length ?? 0) > 0;

				if (!supplierId || hasPaymentMethods) return [];

				return [{ productIndex, itemIndex, supplierId }];
			});
		});

		if (suppliersToEnrich.length === 0) return;

		let cancelled = false;
		setIsEnrichingPaymentMethods(true);

		void (async () => {
			try {
				const detailsResults = await Promise.all(
					suppliersToEnrich.map(({ supplierId }) =>
						supplierServices
							.GetSupplierDetails({
								company_id: companyId,
								module_code: moduleCode,
								supplier_id: supplierId,
							})
							.catch(() => null),
					),
				);

				if (cancelled) return;

				suppliersToEnrich.forEach((target, idx) => {
					const details = detailsResults[idx];
					if (!details) return;

					const currentItem = getValues(
						`products.${target.productIndex}.items.${target.itemIndex}`,
					);
					if (!currentItem || currentItem.supplier_id !== target.supplierId) {
						return;
					}

					const paymentMethods = details.supplier_payment_methods ?? [];
					const preferred = paymentMethods.find(
						(method) =>
							method.is_active !== false && method.payment_method_type,
					)?.payment_method_type;

					const enriched = emptyQuotationItem(
						currentItem.purchase_request_item_id,
						{
							supplier_id: currentItem.supplier_id,
							supplier_legal_name: currentItem.supplier_legal_name ?? "",
						},
						paymentMethods,
						preferred,
					);

					setValue(
						`products.${target.productIndex}.items.${target.itemIndex}.supplier_payment_methods`,
						enriched.supplier_payment_methods,
						{ shouldDirty: false },
					);
					setValue(
						`products.${target.productIndex}.items.${target.itemIndex}.preferred_payment_method`,
						enriched.preferred_payment_method,
						{ shouldDirty: false },
					);
					if (enriched.payment_method) {
						setValue(
							`products.${target.productIndex}.items.${target.itemIndex}.payment_method`,
							enriched.payment_method,
							{ shouldDirty: false },
						);
					}
				});
			} finally {
				if (!cancelled) {
					setIsEnrichingPaymentMethods(false);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [
		isOpen,
		products,
		existingItems,
		reset,
		setValue,
		getValues,
		companyId,
		moduleCode,
	]);

	const handleClose = () => {
		reset({ products: [] });
		onClose();
	};

	const onSubmit = (values: QuoteProductFormValues) => {
		const invalidProduct = values.products.find(
			(product) => product.items.length < MIN_SUPPLIERS_PER_PRODUCT,
		);

		if (invalidProduct) return;

		const items: DraftQuotationItem[] = values.products.flatMap((product) =>
			product.items.map(
				({
					supplier_payment_methods: _spm,
					preferred_payment_method: _ppm,
					payment_method: paymentMethodForm,
					attachments_form: attachmentsForm,
					supplier_legal_name,
					...item
				}) => {
					const isInventoryAvailable = item.inventory_available !== false;
					const images = toDataUrlImages(attachmentsForm?.images);
					const pdfBase64 = attachmentsForm?.pdf_base64?.trim() || null;
					const pdfFileName = attachmentsForm?.pdf_file_name?.trim() || null;
					const hasAttachments = Boolean(pdfBase64) || images.length > 0;

					const paymentMethod =
						normalizePaymentMethodType(paymentMethodForm) ?? null;

					return {
						supplier_id: item.supplier_id,
						purchase_request_item_id: product.purchase_request_item_id,
						has_delivery: Boolean(item.has_delivery),
						has_guarantee: Boolean(item.has_guarantee),
						inventory_available: isInventoryAvailable,
						supplier_selection_justification:
							item.supplier_selection_justification?.trim() || "",
						brand_product: item.brand_product?.trim() || null,
						product_quality: item.product_quality,
						...(paymentMethod ? { payment_method_type: paymentMethod } : {}),
						availability_time: isInventoryAvailable
							? null
							: (item.availability_time ?? null),
						availability_time_type: isInventoryAvailable
							? null
							: (normalizeTimeTypeValue(item.availability_time_type) ?? null),
						delivery_time: item.has_delivery
							? (item.delivery_time ?? null)
							: null,
						delivery_time_type: item.has_delivery
							? (normalizeTimeTypeValue(item.delivery_time_type) ?? null)
							: null,
						warranty_period: item.has_guarantee
							? (item.warranty_period ?? null)
							: null,
						warranty_period_time_type: item.has_guarantee
							? (normalizeTimeTypeValue(item.warranty_period_time_type) ?? null)
							: null,
						...(hasAttachments
							? {
									attachments: {
										pdf_base64: pdfBase64,
										pdf_file_name: pdfFileName,
										images_base64: images.length > 0 ? images : null,
									},
								}
							: {}),
						product_id: product.product_id,
						supplier_legal_name,
					};
				},
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
					? `Complete la cotización para ${productsCount} producto${productsCount === 1 ? "" : "s"}. Los proveedores vinculados se precargan; use "Agregar Proveedor" para incluir adicionales (mínimo ${MIN_SUPPLIERS_PER_PRODUCT} por producto).`
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
												quantity={field.quantity}
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
								disabled={
									productsCount === 0 ||
									isSubmitting ||
									isEnrichingPaymentMethods
								}
								isLoading={isSubmitting || isEnrichingPaymentMethods}
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
