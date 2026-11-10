import { resolvePaymentMethodLabel } from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export const getAcceptedSupplierId = (
  product: PurchaseRequestProductInformation,
) =>
  product.quotations?.find(
    (quote) => quote.is_accepted_for_purchase && quote.is_active !== false,
  )?.supplier_id;

export const resolveNullableLabel = (value?: string | null) =>
  value?.trim() || "—";

export const resolveUnitMeasureLabel = (
  unit?: PurchaseRequestProductInformation["unit_measure_information"] | null,
) => {
  if (!unit) return "—";
  return unit.name?.trim() || unit.symbol?.trim() || "—";
};

/** Obtiene el nombre de la categoría del producto;  */
export const resolveCategoryLabel = (
  productDetails?: PurchaseRequestProductInformation["product_details"] | null,
) => {
  const category = productDetails?.category_information;
  if (!category) return "—";
  return category.name?.trim() || "—";
};

/** Une en un string los métodos de pago activos del proveedor. */
export const resolvePaymentMethodsLabel = (
  methods?: { payment_method_type?: string; is_active?: boolean }[],
) => {
  const labels = (methods ?? [])
    .filter(
      (method) => method.is_active !== false && method.payment_method_type,
    )
    .map((method) => resolvePaymentMethodLabel(method.payment_method_type));
  return labels.length > 0 ? labels.join(", ") : "—";
};
