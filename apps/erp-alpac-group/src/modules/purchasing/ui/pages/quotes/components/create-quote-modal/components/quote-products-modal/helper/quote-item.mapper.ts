import { normalizeTimeTypeToApiValue } from "@app/core/enums/time-type.enum";
import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { PurchaseRequestSupplierProduct } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { ProductQualityEnum } from "@app/modules/purchasing/domain/enums/product-quality";
import {
  resolveSupplierLinkPrice,
  toQuotationCurrency,
} from "@app/modules/purchasing/ui/pages/quotes/utils/resolve-supplier-link-price";
import type {
  DraftQuotationItem,
  QuotationItemForm,
  QuoteProductFormValues,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";
import {
  getActivePaymentMethods,
  normalizePaymentMethodType,
  normalizePaymentMethods,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/helper/quote-payment.helpers";

type EmptyQuotationItemOptions = {
  currency_code?: CurrencyCode | null;
};

export const toNumberOrUndefined = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const emptyQuotationItem = (
  purchaseRequestItemId: string,
  supplier?: Pick<GetSuppliersResponse, "supplier_id" | "supplier_legal_name">,
  paymentMethods?: unknown,
  preferredPayment?: unknown,
  priceOptions?: EmptyQuotationItemOptions,
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
    currency_code: priceOptions?.currency_code ?? null,
    attachments_form: {
      pdf_base64: null,
      pdf_file_name: null,
      images: [],
    },
  };
};

export const mapDraftItemToForm = (
  item: DraftQuotationItem,
): QuotationItemForm => {
  const {
    payment_method_type,
    attachments,
    currency,
    create_supplier_product_if_missing: _createLink,
    ...rest
  } = item;
  return {
    ...rest,
    inventory_available: item.inventory_available !== false,
    product_quality: item.product_quality ?? ProductQualityEnum.Good.textValue,
    payment_method: normalizePaymentMethodType(payment_method_type),
    availability_time_type: normalizeTimeTypeToApiValue(
      item.availability_time_type,
    ),
    delivery_time_type: normalizeTimeTypeToApiValue(item.delivery_time_type),
    warranty_period_time_type: normalizeTimeTypeToApiValue(
      item.warranty_period_time_type,
    ),
    currency_code: toQuotationCurrency(currency),
    attachments_form: {
      pdf_base64: attachments?.pdf_base64 ?? null,
      pdf_file_name: attachments?.pdf_file_name ?? null,
      images: [],
    },
  };
};

export const buildInitialQuotationItems = (
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
      emptyQuotationItem(
        purchaseRequestItemId,
        {
          supplier_id: supplierId,
          supplier_legal_name: legalName,
        },
        undefined,
        undefined,
        {
          currency_code: toQuotationCurrency(supplierProduct.currency),
        },
      ),
    ];
  });
};

export const hasBlockedCatalogPrice = (
  values: QuoteProductFormValues,
  supplierLinksByItemId: Map<string, PurchaseRequestSupplierProduct[]>,
): boolean =>
  values.products.some((product) =>
    product.items.some((item) => {
      const links =
        supplierLinksByItemId.get(product.purchase_request_item_id) ?? [];
      const link = links.find(
        (entry) => entry.supplier_id === item.supplier_id,
      );
      return resolveSupplierLinkPrice(link, product.quantity).amount <= 0;
    }),
  );

export const mapFormValuesToDraftItems = (
  values: QuoteProductFormValues,
): DraftQuotationItem[] =>
  values.products.flatMap((product) =>
    product.items.map(
      ({
        supplier_payment_methods: _spm,
        preferred_payment_method: _ppm,
        payment_method: paymentMethodForm,
        attachments_form: attachmentsForm,
        supplier_legal_name,
        currency_code,
        ...item
      }) => {
        const isInventoryAvailable = item.inventory_available !== false;
        const images = (attachmentsForm?.images ?? [])
          .map((image) => {
            if (image.base64.startsWith("data:")) return image.base64;
            const contentType = image.contentType || "image/jpeg";
            return `data:${contentType};base64,${image.base64}`;
          })
          .slice(0, 2);
        const pdfBase64 = attachmentsForm?.pdf_base64?.trim() || null;
        const pdfFileName = attachmentsForm?.pdf_file_name?.trim() || null;
        const hasAttachments = Boolean(pdfBase64) || images.length > 0;

        const paymentMethod =
          normalizePaymentMethodType(paymentMethodForm) ?? null;
        const currencyValue = toQuotationCurrency(currency_code);

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
            : (normalizeTimeTypeToApiValue(item.availability_time_type) ?? null),
          delivery_time: item.has_delivery
            ? (item.delivery_time ?? null)
            : null,
          delivery_time_type: item.has_delivery
            ? (normalizeTimeTypeToApiValue(item.delivery_time_type) ?? null)
            : null,
          warranty_period: item.has_guarantee
            ? (item.warranty_period ?? null)
            : null,
          warranty_period_time_type: item.has_guarantee
            ? (normalizeTimeTypeToApiValue(item.warranty_period_time_type) ??
              null)
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
          ...(currencyValue ? { currency: currencyValue } : {}),
          create_supplier_product_if_missing: false as const,
          product_id: product.product_id,
          supplier_legal_name,
        };
      },
    ),
  );
