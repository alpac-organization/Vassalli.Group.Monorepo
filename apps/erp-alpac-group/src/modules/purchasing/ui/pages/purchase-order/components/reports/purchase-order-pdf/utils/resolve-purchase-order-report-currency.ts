import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export type PurchaseOrderReportCurrency = "NIO" | "USD";

const PLAIN_AMOUNT_FORMATTER = new Intl.NumberFormat("es-NI", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

function toReportCurrency(
	value: string | null | undefined,
): PurchaseOrderReportCurrency | undefined {
	const currency = value?.trim();
	if (currency === "NIO" || currency === "USD") return currency;
	return undefined;
}

export function resolveAcceptedQuoteCurrency(
	product: PurchaseRequestProductInformation | undefined,
): PurchaseOrderReportCurrency | undefined {
	if (!product) return undefined;

	const acceptedQuote = product.quotations?.find(
		(quote) => quote.is_accepted_for_purchase === true,
	);
	const supplierProductId = acceptedQuote?.supplier_product_id?.trim();
	if (!supplierProductId) return undefined;

	const supplierProduct = product.product_details?.supplier_products?.find(
		(item) => item.supplier_product_id === supplierProductId,
	);

	return toReportCurrency(supplierProduct?.currency);
}

export function formatPurchaseOrderReportMoney(
	amount: number,
	currency?: PurchaseOrderReportCurrency,
): string {
	if (!currency) return PLAIN_AMOUNT_FORMATTER.format(amount ?? 0);
	return formatCurrency(amount ?? 0, currency);
}

export function resolveSharedReportCurrency(
	currencies: Array<PurchaseOrderReportCurrency | undefined>,
): PurchaseOrderReportCurrency | undefined {
	if (currencies.length === 0) return undefined;

	const first = currencies[0];
	if (!first) return undefined;

	for (const currency of currencies) {
		if (currency !== first) return undefined;
	}

	return first;
}

export function buildPurchaseRequestProductMap(
	products: PurchaseRequestProductInformation[] | undefined,
): Map<string, PurchaseRequestProductInformation> {
	const map = new Map<string, PurchaseRequestProductInformation>();
	if (!products?.length) return map;

	for (const product of products) {
		const itemId = product.purchase_request_item_id?.trim();
		if (!itemId) continue;
		map.set(itemId, product);
	}

	return map;
}
