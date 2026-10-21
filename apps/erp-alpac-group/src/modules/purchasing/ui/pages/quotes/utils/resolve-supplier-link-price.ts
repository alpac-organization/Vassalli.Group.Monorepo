import type { PurchaseRequestSupplierProduct } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { QuotationCurrencyValue } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";

export type ResolvedSupplierLinkPrice = {
	amount: number;
	currency: QuotationCurrencyValue;
	source: "tier" | "unit" | "none";
};

const todayUtcDate = (): string => new Date().toISOString().slice(0, 10);

const toDateOnly = (value: string | null | undefined): string | null => {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	return trimmed.slice(0, 10);
};

export const toQuotationCurrency = (
	value: string | number | null | undefined,
): QuotationCurrencyValue | null => {
	if (value === "NIO" || value === 1) return "NIO";
	if (value === "USD" || value === 2) return "USD";
	return null;
};

export const resolveSupplierLinkPrice = (
	link: PurchaseRequestSupplierProduct | null | undefined,
	requestedQuantity: number,
	today: string = todayUtcDate(),
): ResolvedSupplierLinkPrice => {
	const currency = toQuotationCurrency(link?.currency) ?? "NIO";
	if (!link) return { amount: 0, currency, source: "none" };

	let applicableTierPrice = 0;
	let applicableMinQuantity = -1;

	for (const tier of link.tier_prices ?? []) {
		if (tier.min_quantity > requestedQuantity) continue;
		if (!(tier.preferential_price > 0)) continue;

		const validFrom = toDateOnly(tier.valid_from);
		const validTo = toDateOnly(tier.valid_to);
		if (validFrom && validFrom > today) continue;
		if (validTo && validTo < today) continue;
		if (tier.min_quantity <= applicableMinQuantity) continue;

		applicableMinQuantity = tier.min_quantity;
		applicableTierPrice = tier.preferential_price;
	}

	if (applicableTierPrice > 0) {
		return { amount: applicableTierPrice, currency, source: "tier" };
	}

	const unitPrice = Number(link.unit_price ?? 0);
	if (unitPrice > 0) {
		return { amount: unitPrice, currency, source: "unit" };
	}

	return { amount: 0, currency, source: "none" };
};

export const hasUsableNewSupplierLink = (item: {
	unit_price?: number | null;
	unit_measure_id?: string | null;
	currency_code?: string | number | null;
}): boolean =>
	Number(item.unit_price) > 0 &&
	Boolean(item.unit_measure_id?.trim()) &&
	toQuotationCurrency(item.currency_code) !== null;
