import { PaymentConditionEnum } from "@app/core/enums/payment-method.enum";
import { ProductQualityEnum } from "@app/modules/purchasing/domain/enums/product-quality";
import { formatTimeTypeLabel } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/utils/format-type-label";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

const EMPTY = "—";

/** Credit → "Credito", Cash → "Efectivo", else → "—" */
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

/** Excellent → "Excelente", Good → "Buena", etc. */
export function resolveProductQualityLabel(
	quality?: string | null,
): string {
	if (!quality?.trim()) return EMPTY;
	const match = Object.values(ProductQualityEnum).find(
		(entry) =>
			entry.textValue.toLowerCase() === quality.trim().toLowerCase(),
	);
	return match?.label ?? EMPTY;
}

/**
 * true  → "Sí"
 * false → "No — 5 Días" (si hay availability_time)
 * undefined → "—"
 */
export function resolveInventoryAvailabilityLabel(
	quote: Pick<
		PurchaseRequestProductQuotation,
		"iventory_available" | "availability_time" | "availability_time_type"
	>,
): string {
	if (quote.iventory_available == null) return EMPTY;
	if (quote.iventory_available) return "Sí";

	const time = quote.availability_time;
	if (time == null) return "No";

	const timeType = formatTimeTypeLabel(
		quote.availability_time_type != null
			? String(quote.availability_time_type)
			: null,
	);
	return `No — ${time} ${timeType}`.trim();
}
