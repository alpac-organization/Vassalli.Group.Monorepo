import type { GetHistoryQuotesView } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-view.types";

export type QuoteComparisonRow = {
	id: string;
	product_name: string;
	unit_measure_id: string;
	prices_by_supplier: Record<string, number | null>;
	best_supplier_key: string | null;
	best_price: number | null;
};

export type QuoteSupplierColumn = {
	key: string;
	label: string;
};

export function getQuoteSupplierColumns(
	quote: GetHistoryQuotesView | null,
): QuoteSupplierColumn[] {
	if (!quote) return [];

	return (quote.additional_data?.quotes_made ?? []).map((entry, index) => ({
		key: `supplier-${index}`,
		label:
			entry.suppliers_details.supplier_legal_name?.trim() ||
			`Proveedor ${index + 1}`,
	}));
}

export function buildQuoteComparisonRows(
	quote: GetHistoryQuotesView | null,
): QuoteComparisonRow[] {
	if (!quote) return [];

	const quotesMade = quote.additional_data?.quotes_made ?? [];
	const productMap = new Map<string, QuoteComparisonRow>();

	quotesMade.forEach((entry, supplierIndex) => {
		const supplierKey = `supplier-${supplierIndex}`;
		const products = entry.product_details_quotes ?? [];

		products.forEach((product) => {
			const productName = product.product_name?.trim() || "Producto sin nombre";
			const existing = productMap.get(productName);

			if (!existing) {
				productMap.set(productName, {
					id: productName,
					product_name: productName,
					unit_measure_id: product.unit_measure_id || "—",
					prices_by_supplier: { [supplierKey]: product.product_cost ?? null },
					best_supplier_key: null,
					best_price: null,
				});
				return;
			}

			existing.prices_by_supplier[supplierKey] = product.product_cost ?? null;
			if (!existing.unit_measure_id || existing.unit_measure_id === "—") {
				existing.unit_measure_id = product.unit_measure_id || "—";
			}
		});
	});

	return Array.from(productMap.values()).map((row) => {
		let bestSupplierKey: string | null = null;
		let bestPrice: number | null = null;

		Object.entries(row.prices_by_supplier).forEach(([supplierKey, price]) => {
			if (price == null) return;
			if (bestPrice == null || price < bestPrice) {
				bestPrice = price;
				bestSupplierKey = supplierKey;
			}
		});

		return {
			...row,
			best_supplier_key: bestSupplierKey,
			best_price: bestPrice,
		};
	});
}

export function getSupplierTotals(
	quote: GetHistoryQuotesView | null,
): Record<string, number> {
	if (!quote) return {};

	const totals: Record<string, number> = {};

	(quote.additional_data?.quotes_made ?? []).forEach((entry, index) => {
		const key = `supplier-${index}`;
		totals[key] = (entry.product_details_quotes ?? []).reduce(
			(sum, product) => sum + (Number(product.product_cost) || 0),
			0,
		);
	});

	return totals;
}
