import {
  PROVIDER_HEADER_COLORS,
  PROVIDERS_TOTAL_WIDTH,
  QUALITATIVE_PROVIDERS_WIDTH,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/constants/quote-analysis-report";
import type { QuoteAnalysisPdfSupplier } from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";

const PROVIDERS_WIDTH_PCT = Number.parseFloat(PROVIDERS_TOTAL_WIDTH);
const QUALITATIVE_WIDTH_PCT = Number.parseFloat(QUALITATIVE_PROVIDERS_WIDTH);

// constante: de Dos proveedores por hoja
export const SUPPLIERS_PER_PAGE_CHUNK = 2;

/** Parte una lista en grupos de tamaño fijo. se usa en las páginas del PDF. */
export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunkSize = Math.max(size, 1);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

/** Agrupando proveedores por página. Sin proveedores devuelve una hoja vacía para pintar el formato. */
export function chunkSuppliers(
  suppliers: QuoteAnalysisPdfSupplier[],
  size = SUPPLIERS_PER_PAGE_CHUNK,
): QuoteAnalysisPdfSupplier[][] {
  const chunks = chunkArray(suppliers, size);
  return chunks.length > 0 ? chunks : [[]];
}

export function getProviderBlockWidth(supplierCount: number): string {
  const count = Math.max(supplierCount, 1);
  return `${PROVIDERS_WIDTH_PCT / count}%`;
}

export function getProviderHeaderColor(index: number): string {
  return PROVIDER_HEADER_COLORS[index % PROVIDER_HEADER_COLORS.length];
}

export function getQualitativeProviderWidth(supplierCount: number): string {
  const count = Math.max(supplierCount, 1);
  return `${QUALITATIVE_WIDTH_PCT / count}%`;
}
