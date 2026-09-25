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
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { GetSuppliersResponse, SupplierPaymentMethod } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import { httpHandler } from "@app/core/adapters";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SelectSupplierModal } from "../select-supplier-modal/select-supplier-modal";
import type {
	DraftQuotationItem,
	IvaRateOption,
	QuotationItemFieldsProps,
	QuotationItemForm,
	QuoteProductFormValues,
	QuoteProductGroupFieldsProps,
	QuoteProductModalProps,
} from "./quote-product-modal.types";
import { MIN_SUPPLIERS_PER_PRODUCT } from "./quote-product-modal.types";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";
import { validateDecimalNumber, validatePositiveNumber } from "@app/shared/utils/number.utils";

const supplierServices = new SupplierServices(httpHandler);

const paymentMethodEntries = Object.values(PaymentMethodEnum);

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
	const normalized =
		typeof method === "number"
			? normalizePaymentMethodType(method)
			: normalizePaymentMethodType(method);
	if (!normalized) return String(method);
	const entry = paymentMethodEntries.find((e) => e.stringValue === normalized);
	return entry?.label ?? normalized;
};

const toPaymentMethodNumericValue = (
	method?: PaymentMethodType | number | null,
): number | undefined => {
	if (method == null) return undefined;
	if (typeof method === "number") {
		return paymentMethodEntries.some((e) => e.value === method)
			? method
			: undefined;
	}
	return paymentMethodEntries.find((e) => e.stringValue === method)?.value;
};

const toPaymentMethodStringValue = (
	method?: number | PaymentMethodType | null,
): PaymentMethodType | undefined => normalizePaymentMethodType(method);

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

const availabilityTimeTypeOptions = Object.values(TimeTypeEnum).map((option) => ({
	value: String(option.value),
	label: option.label,
}));

const conditionalFieldsGridClassName =
	"mt-4 grid grid-cols-1 gap-4 md:grid-cols-2";

const PRESET_IVA_RATES = ["10", "15"] as const;

const IVA_RATE_OPTIONS = [
	{ value: "10", label: "10%" },
	{ value: "15", label: "15%" },
	{ value: "other", label: "Otro" },
];

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const resolveIvaRate = (
	rate?: IvaRateOption,
	customRate?: string | number,
) => {
	if (rate === "other") return (Number(customRate) || 0) / 100;
	if (!rate) return 0;
	return Number(rate) / 100;
};

const inferIvaFields = (
	price?: number,
	iva?: number,
): Pick<QuotationItemForm, "has_iva" | "iva_rate" | "custom_iva_rate"> => {
	if (iva == null || iva <= 0 || !price || price <= 0) {
		return { has_iva: false, iva_rate: undefined, custom_iva_rate: undefined };
	}

	const percent = roundMoney((iva / price) * 100);
	const percentKey = String(percent);

	if (PRESET_IVA_RATES.includes(percentKey as (typeof PRESET_IVA_RATES)[number])) {
		return {
			has_iva: true,
			iva_rate: percentKey as IvaRateOption,
			custom_iva_rate: undefined,
		};
	}

	return {
		has_iva: true,
		iva_rate: "other",
		custom_iva_rate: percent,
	};
};

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
	} else if (active.length === 0 && preferred) {
		autoPayment = preferred;
	}

	return {
		supplier_id: supplier?.supplier_id ?? "",
		supplier_legal_name: supplier?.supplier_legal_name ?? "",
		purchase_request_item_id: purchaseRequestItemId,
		has_delivery: false,
		has_guarantee: false,
		iventory_available: true,
		has_iva: false,
		iva_rate: undefined,
		custom_iva_rate: undefined,
		price: 0,
		iva: undefined,
		price_unit: undefined,
		brand_product: "",
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
	};
};

const toNumberOrUndefined = (value: unknown) => {
	if (value === "" || value === null || value === undefined) return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
};

const deliveryTime = TimeTypeOptions.filter(option => option.value !== TimeTypeEnum.Years.value);

const deliveryTimeOptions = deliveryTime.map((option) => ({
	value: String(option.value),
	label: option.label,
}));

const timeTypeOptions = TimeTypeOptions.map((option) => ({
	value: String(option.value),
	label: option.label,
}));

function QuotationItemFields({
	productIndex,
	itemIndex,
	accordionValue,
	canRemove,
	supplierLegalName,
	quantity,
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
		name: `products.${productIndex}.items.${itemIndex}.iventory_available`,
	});
	const supplierPaymentMethods = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.supplier_payment_methods`,
	});
	const preferredPaymentMethod = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.preferred_payment_method`,
	});
	const hasIva = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.has_iva`,
	});
	const ivaRate = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.iva_rate`,
	});
	const customIvaRate = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.custom_iva_rate`,
	});
	const priceUnit = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.price_unit`,
	});

	const itemErrors = errors.products?.[productIndex]?.items?.[itemIndex];
	const fieldPath = `products.${productIndex}.items.${itemIndex}` as const;
	const supplierLabel =
		supplierLegalName || `Proveedor ${itemIndex + 1}`;

	const activePaymentMethods = getActivePaymentMethods(supplierPaymentMethods);
	const paymentMethodOptions = buildPaymentMethodOptions(supplierPaymentMethods ?? []);
	const hasSinglePaymentMethod = activePaymentMethods.length === 1;
	const preferredPaymentNormalized = normalizePaymentMethodType(preferredPaymentMethod);
	const usePreferredAsPaymentMethod =
		activePaymentMethods.length === 0 && Boolean(preferredPaymentNormalized);
	const hasNoPaymentMethods =
		activePaymentMethods.length === 0 && !preferredPaymentNormalized;
	const lockedPaymentMethod =
		hasSinglePaymentMethod
			? activePaymentMethods[0].payment_method_type
			: usePreferredAsPaymentMethod
				? preferredPaymentNormalized
				: undefined;

	useEffect(() => {
		const unit = Number(priceUnit) || 0;
		const calculatedPrice = roundMoney(quantity * unit);
		const rate = hasIva ? resolveIvaRate(ivaRate, customIvaRate) : 0;

		setValue(`${fieldPath}.price`, calculatedPrice, { shouldValidate: true });
		setValue(
			`${fieldPath}.iva`,
			hasIva ? roundMoney(calculatedPrice * rate) : undefined,
		);
	}, [customIvaRate, fieldPath, hasIva, ivaRate, priceUnit, quantity, setValue]);

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

				<InputText
					label="Precio unitario"
					type="number"
					min="0"
					step="0.01"
					isRequired
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.price_unit`, {
						required: "El precio unitario es requerido.",
						setValueAs: toNumberOrUndefined,
						validate: (value) =>
							(value != null && Number(value) > 0) ||
							"El precio unitario debe ser mayor a 0.",
					})}
					error={itemErrors?.price_unit?.message}
				/>

				<InputText
					label="Precio"
					type="number"
					min="0"
					step="0.01"
					disabled
					placeholder="0.00"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.price`, {
						setValueAs: (value) => Number(value) || 0,
						validate: (value) =>
							Number(value) > 0 || "El precio debe ser mayor a 0.",
					})}
					error={itemErrors?.price?.message}
				/>

				<div className="flex flex-col gap-2 mt-1">
					<Controller
						control={control}
						name={`${fieldPath}.has_iva`}
						render={({ field }) => (
							<Checkbox
								label="Incluye IVA"
								checked={Boolean(field.value)}
								onChange={(event) => {
									const checked = event.target.checked;
									field.onChange(checked);

									if (!checked) {
										setValue(`${fieldPath}.iva_rate`, undefined);
										setValue(`${fieldPath}.custom_iva_rate`, undefined);
										setValue(`${fieldPath}.iva`, undefined);
										return;
									}

									if (!ivaRate) {
										setValue(`${fieldPath}.iva_rate`, "15");
									}
								}}
							/>
						)}
					/>

					<InputText
						type="number"
						min="0"
						step="0.01"
						disabled
						placeholder="0.00"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.iva`, {
							setValueAs: toNumberOrUndefined,
						})}
					/>
				</div>

				{hasIva ? (
					<Controller
						control={control}
						name={`${fieldPath}.iva_rate`}
						rules={{
							validate: (value) =>
								!hasIva || Boolean(value) || "Seleccione la tasa de IVA.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tasa de IVA"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={IVA_RATE_OPTIONS}
								value={field.value ?? ""}
								onChange={(value) => {
									const nextRate = (value || undefined) as IvaRateOption | undefined;
									field.onChange(nextRate);

									if (nextRate !== "other") {
										setValue(`${fieldPath}.custom_iva_rate`, undefined);
									}
								}}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.iva_rate?.message}
							/>
						)}
					/>
				) : null}

				{hasIva && ivaRate === "other" ? (
					<InputText
						label="Otro %"
						type="text"
						inputMode="decimal"
						isRequired
						placeholder="Ej. 12"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.custom_iva_rate`, {
							required: hasIva && ivaRate === "other"
								? "El porcentaje de IVA es requerido."
								: false,
							validate: (value) => {
								if (!hasIva || ivaRate !== "other") return true;

								const decimalValidation = validateDecimalNumber(value);
								if (decimalValidation !== true) return decimalValidation;

								const positiveValidation = validatePositiveNumber(value);
								if (positiveValidation !== true) return positiveValidation;

								const percent = Number(value);
								return (
									(percent >= 1 && percent <= 30) ||
									"El porcentaje debe estar entre 1 y 30."
								);
							},
							onChange: (event) => {
								event.target.value = formatNumberWithDecimals(
									event.target.value,
									true,
									30
								);
							},
						})}
						error={itemErrors?.custom_iva_rate?.message}
					/>
				) : null}

			</div>

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
					name={`${fieldPath}.iventory_available`}
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
							required: inventoryAvailable === false
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
								(value != null && Number(value) > 0) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={availabilityTimeTypeOptions}
								value={field.value != null ? String(field.value) : ""}
								onChange={(value) =>
									field.onChange(value ? Number(value) : undefined)
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
								(value != null && Number(value) > 0) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired
								options={deliveryTimeOptions}
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

			<div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-neutral-600">
				{preferredPaymentNormalized ? (
					<div className="flex flex-col gap-1">
						<span className={`text-[13px] font-medium ${quoteFormLabelClassName}`}>
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
								El proveedor no tiene métodos de pago configurados.
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
						<span className={`text-[13px] font-medium ${quoteFormLabelClassName}`}>
							Método de pago
						</span>
						<span className="text-sm text-slate-600 dark:text-slate-300">
							{resolvePaymentMethodLabel(lockedPaymentMethod)}
						</span>
						<input
							type="hidden"
							{...register(`${fieldPath}.payment_method`, {
								required: "Seleccione un método de pago.",
							})}
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
									onChange={(value) =>
										field.onChange(value || undefined)
									}
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
	quantity,
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
				const preferred =
					details?.supplier_details?.preferred_payment_method;

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
							quantity={quantity}
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
				const productId = product.product_details?.product_id ?? "";
				const purchaseRequestItemId = product?.purchase_request_item_id ?? "";

				const productItems = existingItems.filter(
					(item) =>
						item.product_id === productId ||
						(purchaseRequestItemId &&
							item.purchase_request_item_id === purchaseRequestItemId),
				);

				return {
					product_id: productId,
					purchase_request_item_id: purchaseRequestItemId,
					product_name:
						product.product_details?.product_name?.trim() ||
						"Producto sin nombre",
					category_name:
						product.product_details?.category_information?.name?.trim() ||
						null,
					quantity: product.quantity,
					items: productItems.map((item) => {
						const { payment_method_type, ...rest } = item;
						return {
							...rest,
							payment_method: toPaymentMethodStringValue(payment_method_type),
							...inferIvaFields(item.price, item.iva),
						};
					}),
				};
			}),
		});
	}, [isOpen, products, existingItems, reset]);

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
			product.items.map(({
				has_iva: _hasIva,
				iva_rate: _ivaRate,
				custom_iva_rate: _customIvaRate,
				supplier_payment_methods: _spm,
				preferred_payment_method: _ppm,
				payment_method: paymentMethodForm,
				...item
			}) => {
				const isInventoryAvailable = item.iventory_available !== false;
				const paymentMethodValue = toPaymentMethodNumericValue(paymentMethodForm);

				return {
					...item,
					payment_method_type: paymentMethodValue,
					iventory_available: !isInventoryAvailable ? false : true,
					availability_time: isInventoryAvailable ? undefined : item.availability_time,
					availability_time_type: isInventoryAvailable ? undefined : item.availability_time_type,
					supplier_selection_justification:
						item.supplier_selection_justification?.trim() || undefined,
					product_id: product.product_id,
					purchase_request_item_id: product.purchase_request_item_id,
				};
			}),
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
