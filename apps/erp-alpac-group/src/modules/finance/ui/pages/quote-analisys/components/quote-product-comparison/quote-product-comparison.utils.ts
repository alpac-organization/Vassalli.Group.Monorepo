import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export function chunkQuotations<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function getQuoteTotalPrice(
  quote: Pick<PurchaseRequestProductQuotation, "price" | "iva">,
): number {
  return (quote.price ?? 0) + (quote.iva ?? 0);
}

export function getQuoteIvaPercentage(
  quote: Pick<PurchaseRequestProductQuotation, "price" | "iva">,
): number | null {
  const price = quote.price ?? 0;
  const iva = quote.iva ?? 0;
  if (price <= 0) return null;
  return Math.round((iva / price) * 10000) / 100;
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

export function formatPeriodLabel(
  value: number | null,
  type: string | null,
): string | null {
  if (value == null) return null;
  const normalizedType = (type ?? "").toLowerCase();
  const unitMap: Record<string, [string, string]> = {
    day: ["día", "días"],
    days: ["día", "días"],
    week: ["semana", "semanas"],
    weeks: ["semana", "semanas"],
    month: ["mes", "meses"],
    months: ["mes", "meses"],
    year: ["año", "años"],
    years: ["año", "años"],
  };
  const [singular, plural] = unitMap[normalizedType] ?? ["", ""];
  if (!singular) return String(value);
  return `${value} ${value === 1 ? singular : plural}`;
}
