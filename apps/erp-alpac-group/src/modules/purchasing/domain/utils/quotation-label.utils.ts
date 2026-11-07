import {
  PaymentConditionEnum,
  PaymentMethodEnum,
} from "@app/core/enums/payment-method.enum";
import { formatTimeTypeLabel } from "@app/core/enums/time-type.enum";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { ProductQualityEnum } from "@app/modules/purchasing/domain/enums/product-quality";

const EMPTY = "—";

/** mapea la condición de pago del API (Credit/Cash) a un tab legible para UI. */
export function resolvePaymentConditionLabel(
  paymentMethod?: string | null,
): string {
  if (!paymentMethod?.trim()) return EMPTY;
  const match = Object.values(PaymentConditionEnum).find(
    (entry) =>
      entry.stringValue.toLowerCase() === paymentMethod.trim().toLowerCase(),
  );
  return match?.label ?? EMPTY;
}

/** se mapea el método de pago del API (ACH, LocalTransfer, etc.)  */
export function resolvePaymentMethodLabel(
  paymentMethod?: string | null,
): string {
  if (!paymentMethod?.trim()) return EMPTY;
  const match = Object.values(PaymentMethodEnum).find(
    (entry) =>
      entry.stringValue.toLowerCase() === paymentMethod.trim().toLowerCase(),
  );
  return match?.label ?? paymentMethod;
}

/** mapea la calidad del producto del API (Excellent, Good, etc.) a tag legible para UI. */
export function resolveProductQualityLabel(quality?: string | null): string {
  if (!quality?.trim()) return EMPTY;
  const match = Object.values(ProductQualityEnum).find(
    (entry) => entry.textValue.toLowerCase() === quality.trim().toLowerCase(),
  );
  return match?.label ?? EMPTY;
}

export function resolveInventoryAvailabilityLabel(
  quote: Pick<
    PurchaseRequestProductQuotation,
    | "inventory_available"
    | "iventory_available"
    | "availability_time"
    | "availability_time_type"
  >,
): string {
  const inventoryAvailable =
    quote.inventory_available ?? quote.iventory_available;
  if (inventoryAvailable == null) return EMPTY;
  if (inventoryAvailable) return "Sí";

  const time = quote.availability_time;
  if (time == null) return "No";

  const timeType = formatTimeTypeLabel(quote.availability_time_type);
  return `No — ${time} ${timeType}`.trim();
}
