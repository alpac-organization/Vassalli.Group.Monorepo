import { formatCurrency } from "@app/shared/utils/currency.utils";
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
  quote: Pick<
    PurchaseRequestProductQuotation,
    "price" | "price_total" | "price_unit"
  >,
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

export const USD_TO_NIO_EXCHANGE_RATE = 36.6243;

function toComparableCordobas(
  quote: PurchaseRequestProductQuotation,
  supplierProducts?: PurchaseRequestSupplierProduct[],
): number {
  const total = getQuoteTotalPrice(quote);
  if (resolveQuoteCurrency(quote, supplierProducts) !== "USD") return total;
  return total * USD_TO_NIO_EXCHANGE_RATE;
}

export function getBestPriceQuotationId(
  quotations: PurchaseRequestProductQuotation[],
  supplierProducts?: PurchaseRequestSupplierProduct[],
): string | null {
  const active = quotations.filter((quote) => quote.is_active);
  if (active.length === 0) return null;

  let best = active[0];
  let bestAmount = toComparableCordobas(best, supplierProducts);
  for (const quote of active) {
    const amount = toComparableCordobas(quote, supplierProducts);
    if (amount < bestAmount) {
      best = quote;
      bestAmount = amount;
    }
  }
  return best.quotation_id;
}

export function resolveQuoteCurrency(
  quote: PurchaseRequestProductQuotation,
  supplierProducts?: PurchaseRequestSupplierProduct[],
): string | undefined {
  const currency = findSupplierProductForQuote(
    supplierProducts,
    quote,
  )?.currency?.trim();
  return currency || undefined;
}

export function formatQuoteMoney(
  amount: number | null | undefined,
  quote: PurchaseRequestProductQuotation,
  supplierProducts?: PurchaseRequestSupplierProduct[],
): string {
  return formatCurrency(
    amount ?? 0,
    resolveQuoteCurrency(quote, supplierProducts),
  );
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
