import { formatTimeTypeLabel } from "@app/core/enums/time-type.enum";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import {
  getQuoteSubtotal,
  getQuoteTotalPrice,
  resolveQuoteCurrency,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";
import { EMPTY_CELL } from "@app/modules/finance/ui/pages/quote-analisys/templates/constants/quote-analysis-report";
import type {
  QuoteAnalysisPdfItemCell,
  QuoteAnalysisPdfItemRow,
  QuoteAnalysisPdfQualitative,
  QuoteAnalysisPdfSupplier,
  QuoteAnalysisPdfTotals,
  QuoteAnalysisPdfViewModel,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";
import type {
  PurchaseRequestProductInformation,
  PurchaseRequestProductQuotation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import {
  resolveInventoryAvailabilityLabel,
  resolvePaymentMethodLabel,
  resolveProductQualityLabel,
} from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";

/** Proveedor aceptado y los textos de justificación que van al cierre del PDF. */
type SelectedSupplier = {
  name: string;
  justifications: string[];
};

/** Producto con una sola cotización activa por proveedor. */
type IndexedProduct = {
  product: PurchaseRequestProductInformation;
  quotesBySupplier: Map<string, PurchaseRequestProductQuotation>;
};

function resolveSupplierId(
  quote: PurchaseRequestProductQuotation,
): string | undefined {
  return (
    quote.supplier_id || quote.supplier_information?.supplier_id || undefined
  );
}

/** Nombre legal para el encabezado. Vacío se muestra como "—". */
function resolveSupplierName(quote: PurchaseRequestProductQuotation): string {
  return quote.supplier_information?.suppliers_legal_name?.trim() || EMPTY_CELL;
}

/** Subtotal, IVA y total en cero por proveedor, para poder sumar las celdas después. */
function emptyTotals(supplierIds: string[]): QuoteAnalysisPdfTotals {
  const subtotal: Record<string, number> = {};
  const iva: Record<string, number> = {};
  const total: Record<string, number> = {};
  for (const id of supplierIds) {
    subtotal[id] = 0;
    iva[id] = 0;
    total[id] = 0;
  }
  return { subtotal, iva, total };
}

/** Guarda y mapea la currency del vínculo. . */
function rememberSupplierCurrency(
  currencyBySupplierId: Map<string, string | null>,
  supplierId: string,
  currency: string | undefined,
) {
  const next = currency ?? null;
  const previous = currencyBySupplierId.get(supplierId);
  if (previous === undefined) {
    currencyBySupplierId.set(supplierId, next);
    return;
  }
  if (previous !== null && previous !== next) {
    currencyBySupplierId.set(supplierId, null);
  }
}

/** Junta quién fue aceptado y su justificación para el bloque final del PDF. */
function recordSelection(
  selectedBySupplier: Map<string, SelectedSupplier>,
  quote: PurchaseRequestProductQuotation,
  supplierId: string | undefined,
) {
  if (!quote.is_accepted_for_purchase) return;

  const selectionKey = supplierId || quote.quotation_id;
  if (!selectionKey) return;

  const name = resolveSupplierName(quote);
  const justification = quote.supplier_selection_justification?.trim();
  const entry = selectedBySupplier.get(selectionKey) ?? {
    name,
    justifications: [],
  };
  if (justification && !entry.justifications.includes(justification)) {
    entry.justifications.push(justification);
  }
  selectedBySupplier.set(selectionKey, entry);
}

function rememberRepresentative(
  representativeQuotes: Map<string, PurchaseRequestProductQuotation>,
  supplierId: string,
  quote: PurchaseRequestProductQuotation,
) {
  const existing = representativeQuotes.get(supplierId);
  if (quote.is_accepted_for_purchase) {
    if (!existing?.is_accepted_for_purchase) {
      representativeQuotes.set(supplierId, quote);
    }
    return;
  }
  if (!existing) representativeQuotes.set(supplierId, quote);
}

/** Una pasada sobre las cotizaciones activas: columnas, selección y cotización por proveedor. */
function indexProducts(products: PurchaseRequestProductInformation[]): {
  indexedProducts: IndexedProduct[];
  suppliers: QuoteAnalysisPdfSupplier[];
  representativeQuotes: Map<string, PurchaseRequestProductQuotation>;
  selectedBySupplier: Map<string, SelectedSupplier>;
} {
  const suppliersMap = new Map<string, QuoteAnalysisPdfSupplier>();
  const representativeQuotes = new Map<
    string,
    PurchaseRequestProductQuotation
  >();
  const selectedBySupplier = new Map<string, SelectedSupplier>();
  const indexedProducts: IndexedProduct[] = [];

  for (const product of products) {
    const quotesBySupplier = new Map<string, PurchaseRequestProductQuotation>();

    for (const quote of product.quotations ?? []) {
      if (!quote.is_active) continue;

      const supplierId = resolveSupplierId(quote);
      recordSelection(selectedBySupplier, quote, supplierId);
      if (!supplierId) continue;

      if (!quotesBySupplier.has(supplierId)) {
        quotesBySupplier.set(supplierId, quote);
      }
      if (!suppliersMap.has(supplierId)) {
        suppliersMap.set(supplierId, {
          supplierId,
          name: resolveSupplierName(quote),
        });
      }
      rememberRepresentative(representativeQuotes, supplierId, quote);
    }

    indexedProducts.push({ product, quotesBySupplier });
  }

  return {
    indexedProducts,
    suppliers: Array.from(suppliersMap.values()),
    representativeQuotes,
    selectedBySupplier,
  };
}

function formatPeriod(amount: number | null, timeType: string | null): string {
  if (amount == null) return EMPTY_CELL;
  return `${amount} ${formatTimeTypeLabel(timeType)}`.trim();
}

function buildItemCell(
  quote: PurchaseRequestProductQuotation,
  currency: string | undefined,
): QuoteAnalysisPdfItemCell {
  const rawPrice = getQuoteSubtotal(quote);
  const rawIva = quote.iva ?? 0;
  const rawTotal = getQuoteTotalPrice(quote);

  return {
    brand: quote.brand_product?.trim() || EMPTY_CELL,
    unitPrice: formatCurrency(quote.price_unit ?? 0, currency),
    iva: formatCurrency(rawIva, currency),
    total: formatCurrency(rawTotal, currency),
    rawPrice,
    rawIva,
    rawTotal,
  };
}

function resolveUnitMeasure(
  product: PurchaseRequestProductInformation,
): string {
  return (
    product.unit_measure_information?.name?.trim() ||
    product.unit_measure_information?.symbol?.trim() ||
    EMPTY_CELL
  );
}

function resolveDescription(
  product: PurchaseRequestProductInformation,
): string {
  return (
    product.description?.trim() ||
    product.product_details?.product_name?.trim() ||
    EMPTY_CELL
  );
}

function buildItems(
  indexedProducts: IndexedProduct[],
  suppliers: QuoteAnalysisPdfSupplier[],
  totals: QuoteAnalysisPdfTotals,
  currencyBySupplierId: Map<string, string | null>,
): QuoteAnalysisPdfItemRow[] {
  return indexedProducts.map(({ product, quotesBySupplier }) => {
    const cellsBySupplierId: QuoteAnalysisPdfItemRow["cellsBySupplierId"] = {};

    for (const supplier of suppliers) {
      const quote = quotesBySupplier.get(supplier.supplierId);
      if (!quote) {
        cellsBySupplierId[supplier.supplierId] = null;
        continue;
      }

      const currency = resolveQuoteCurrency(
        quote,
        product.product_details?.supplier_products,
      );
      rememberSupplierCurrency(
        currencyBySupplierId,
        supplier.supplierId,
        currency,
      );

      const cell = buildItemCell(quote, currency);
      cellsBySupplierId[supplier.supplierId] = cell;
      totals.subtotal[supplier.supplierId] += cell.rawPrice;
      totals.iva[supplier.supplierId] += cell.rawIva;
      totals.total[supplier.supplierId] += cell.rawTotal;
    }

    return {
      quantity: String(product.quantity ?? EMPTY_CELL),
      unitMeasure: resolveUnitMeasure(product),
      description: resolveDescription(product),
      cellsBySupplierId,
    };
  });
}

/** Tabla de criterios (entrega, garantía, calidad, inventario y pago) en texto . */
function buildQualitative(
  suppliers: QuoteAnalysisPdfSupplier[],
  representativeQuotes: Map<string, PurchaseRequestProductQuotation>,
  currencyBySupplierId: Map<string, string | null>,
): QuoteAnalysisPdfQualitative {
  const qualitative: QuoteAnalysisPdfQualitative = {
    delivery: {},
    transport: {},
    warranty: {},
    quality: {},
    inventory: {},
    paymentMethod: {},
  };

  for (const supplier of suppliers) {
    supplier.currency =
      currencyBySupplierId.get(supplier.supplierId) || undefined;

    const quote = representativeQuotes.get(supplier.supplierId);
    qualitative.delivery[supplier.supplierId] = quote
      ? formatPeriod(quote.delivery_time, quote.delivery_time_type)
      : EMPTY_CELL;
    qualitative.transport[supplier.supplierId] = quote
      ? quote.has_delivery
        ? "Sí"
        : "No"
      : EMPTY_CELL;
    qualitative.warranty[supplier.supplierId] = quote
      ? formatPeriod(quote.warranty_period, quote.warranty_period_time_type)
      : EMPTY_CELL;
    qualitative.quality[supplier.supplierId] = quote
      ? resolveProductQualityLabel(quote.product_quality)
      : EMPTY_CELL;
    qualitative.inventory[supplier.supplierId] = quote
      ? resolveInventoryAvailabilityLabel(quote)
      : EMPTY_CELL;
    qualitative.paymentMethod[supplier.supplierId] = quote
      ? resolvePaymentMethodLabel(
          quote.payment_method_type ??
            (typeof quote.payment_method === "string"
              ? quote.payment_method
              : null),
        )
      : EMPTY_CELL;
  }

  return qualitative;
}

/** "Proveedor seleccionado" y "Justificación" del cierre, unidos si hay varios. */
function joinSelected(selectedBySupplier: Map<string, SelectedSupplier>): {
  selectedSupplierNames: string;
  justification: string;
} {
  const selected = Array.from(selectedBySupplier.values());
  const selectedSupplierNames =
    selected
      .map((entry) => entry.name)
      .filter(Boolean)
      .join(", ") || EMPTY_CELL;
  const justification =
    selected
      .map((entry) => {
        const text = entry.justifications.join(" ");
        return text ? `${entry.name}: ${text}` : null;
      })
      .filter(Boolean)
      .join(". ") || EMPTY_CELL;

  return { selectedSupplierNames, justification };
}

/** Arma el objeto que el PDF solo pinta: mismas cotizaciones vigentes, moneda. */
export function buildQuoteAnalysisPdfViewModel(
  detail: RequisitionAccountingReviewDetailsDto,
  products: PurchaseRequestProductInformation[],
): QuoteAnalysisPdfViewModel {
  const {
    indexedProducts,
    suppliers,
    representativeQuotes,
    selectedBySupplier,
  } = indexProducts(products);
  const totals = emptyTotals(suppliers.map((supplier) => supplier.supplierId));
  const currencyBySupplierId = new Map<string, string | null>();
  const items = buildItems(
    indexedProducts,
    suppliers,
    totals,
    currencyBySupplierId,
  );
  const qualitative = buildQualitative(
    suppliers,
    representativeQuotes,
    currencyBySupplierId,
  );
  const { selectedSupplierNames, justification } =
    joinSelected(selectedBySupplier);

  return {
    suppliers,
    items,
    totals,
    qualitative,
    selectedSupplierNames,
    justification,
    elaboratedBy:
      detail.purchase_request?.creator_user_information?.fullname?.trim() ||
      detail.sent_by_user_information?.fullname?.trim() ||
      EMPTY_CELL,
  };
}
