import type { QuoteProductComparisonProps } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.types";
import {
  chunkQuotations,
  getBestPriceQuotationId,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";
import { MAX_COLUMNS } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison.constants";
import { QuoteCard } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-card";
import { QuoteComparisonTable } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-comparison-table";
import { SupplierCatalogPanel } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/supplier-catalog-panel";

export function QuoteProductComparison({
  itemId,
  quotations,
  recommendations,
  supplierProducts,
  selectedQuotationId,
  onRequestAccept,
  isAccepting,
  accountingReviewStatus,
}: QuoteProductComparisonProps) {
  const activeQuotations = quotations.filter((quote) => quote.is_active);
  const bestPriceId = getBestPriceQuotationId(activeQuotations);
  const bestWarrantyId = recommendations?.best_warranty_quotation_id ?? null;
  const bestDeliveryId = recommendations?.best_delivery_quotation_id ?? null;
  const chunks = chunkQuotations(activeQuotations, MAX_COLUMNS);
  const catalogProducts = supplierProducts ?? [];

  if (activeQuotations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-600 dark:bg-[#272b34] dark:text-slate-400">
        No hay cotizaciones disponibles para este producto.
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <SupplierCatalogPanel supplierProducts={catalogProducts} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {activeQuotations.map((quote) => {
          const isSelected =
            selectedQuotationId === quote.quotation_id ||
            quote.is_accepted_for_purchase;

          return (
            <QuoteCard
              key={quote.quotation_id}
              quote={quote}
              accountingReviewStatus={accountingReviewStatus}
              isSelected={isSelected}
              isBestPrice={bestPriceId === quote.quotation_id}
              isBestWarranty={bestWarrantyId === quote.quotation_id}
              isBestDelivery={bestDeliveryId === quote.quotation_id}
              isAccepting={isAccepting}
              supplierProducts={catalogProducts}
              onAccept={() => onRequestAccept(itemId, quote)}
            />
          );
        })}
      </div>

      <QuoteComparisonTable
        itemId={itemId}
        chunks={chunks}
        catalogProducts={catalogProducts}
        selectedQuotationId={selectedQuotationId}
        bestPriceId={bestPriceId}
        bestWarrantyId={bestWarrantyId}
        bestDeliveryId={bestDeliveryId}
        isAccepting={isAccepting}
        accountingReviewStatus={accountingReviewStatus}
        onRequestAccept={onRequestAccept}
      />
    </div>
  );
}
