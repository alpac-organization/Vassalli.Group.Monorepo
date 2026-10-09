import type {
	PurchaseRequestProductQuotation,
	PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export function chunkQuotations<T>(items: T[], size: number): T[][] {
	if (size <= 0) return [];
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

export function getQuoteSubtotal(
	quote: Pick<PurchaseRequestProductQuotation, "price" | "price_total" | "price_unit">,
): number {
	if (quote.price_total != null && quote.price_total > 0) {
		return quote.price_total;
	}
	if (quote.price != null && quote.price > 0) {
		return quote.price;
	}
	return quote.price_unit ?? 0;
}

export function getQuoteTotalPrice(
	quote: Pick<
		PurchaseRequestProductQuotation,
		"price" | "price_total" | "price_unit" | "iva"
	>,
): number {
	return getQuoteSubtotal(quote) + (quote.iva ?? 0);
}

export function getQuoteIvaPercentage(
	quote: Pick<
		PurchaseRequestProductQuotation,
		"price" | "price_total" | "price_unit" | "iva"
	>,
): number | null {
	const subtotal = getQuoteSubtotal(quote);
	const iva = quote.iva ?? 0;
	if (subtotal <= 0) return null;
	return Math.round((iva / subtotal) * 10000) / 100;
}

export function getBestPriceQuotationId(
	quotations: PurchaseRequestProductQuotation[],
): string | null {
	const active = quotations.filter((quote) => quote.is_active);
	if (active.length === 0) return null;

	let best = active[0];
	for (const quote of active) {
		if (getQuoteTotalPrice(quote) < getQuoteTotalPrice(best)) {
			best = quote;
		}
	}
	return best.quotation_id;
}

export function findSupplierProductForQuote(
	supplierProducts: PurchaseRequestSupplierProduct[] | undefined,
	quote: PurchaseRequestProductQuotation,
): PurchaseRequestSupplierProduct | null {
	if (!supplierProducts?.length) return null;

	const byProductId = supplierProducts.find(
		(item) =>
			quote.supplier_product_id &&
			item.supplier_product_id === quote.supplier_product_id,
	);
	if (byProductId) return byProductId;

	return (
		supplierProducts.find((item) => item.supplier_id === quote.supplier_id) ??
		null
	);
}
