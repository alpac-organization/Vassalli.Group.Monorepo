import { Layers } from "lucide-react";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import { QuoteQuotationAttachments } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-quotation-attachments/quote-quotation-attachments";
import type {
  PurchaseRequestProductQuotation,
  PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { COMPARISON_ROWS } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison-rows";
import {
  MAX_COLUMNS,
  TEXT_WRAP_CLASS,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison.constants";
import { QuoteAcceptButton } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-accept-button";
import { SupplierQuoteHeading } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/recommendation-badges";
import { CatalogPriceRow } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/supplier-catalog-panel";

function getGridTemplate(): string {
  return `minmax(148px, 180px) repeat(${MAX_COLUMNS}, minmax(220px, 1fr))`;
}

function EmptyQuoteCells({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className="border-0 bg-transparent"
          aria-hidden
        />
      ))}
    </>
  );
}

export type QuoteComparisonTableProps = {
  itemId: string;
  chunks: PurchaseRequestProductQuotation[][];
  catalogProducts: PurchaseRequestSupplierProduct[];
  selectedQuotationId?: string;
  bestPriceId: string | null;
  bestWarrantyId: string | null;
  bestDeliveryId: string | null;
  isAccepting?: boolean;
  accountingReviewStatus: accountingReviewStatusType;
  onRequestAccept: (
    itemId: string,
    quotation: PurchaseRequestProductQuotation,
  ) => void;
};

export function QuoteComparisonTable({
  itemId,
  chunks,
  catalogProducts,
  selectedQuotationId,
  bestPriceId,
  bestWarrantyId,
  bestDeliveryId,
  isAccepting,
  accountingReviewStatus,
  onRequestAccept,
}: QuoteComparisonTableProps) {
  return (
    <div className="hidden flex-col gap-4 lg:flex">
      {chunks.map((chunk, chunkIndex) => {
        const emptyCount = MAX_COLUMNS - chunk.length;

        return (
          <div
            key={`chunk-${chunkIndex}`}
            className="w-full min-w-0 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/60"
          >
            <div
              className="min-w-[52rem]"
              style={{
                display: "grid",
                gridTemplateColumns: getGridTemplate(),
              }}
            >
              <div className="flex items-center bg-slate-50 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-[#232830] dark:text-slate-400 xl:px-4">
                Cotización
              </div>
              {chunk.map((quote, quoteIndex) => {
                const isSelected =
                  selectedQuotationId === quote.quotation_id ||
                  quote.is_accepted_for_purchase;
                const isLastFilled = quoteIndex === chunk.length - 1;

                return (
                  <div
                    key={quote.quotation_id}
                    className={`flex flex-col gap-3 border-l border-slate-200 px-3 py-3 dark:border-slate-700/60 xl:px-4 ${
                      isLastFilled
                        ? "border-r border-slate-200 dark:border-slate-700/60"
                        : ""
                    } ${
                      isSelected
                        ? "bg-blue-50/60 dark:bg-blue-500/10"
                        : "bg-white dark:bg-[#1e2229]"
                    }`}
                  >
                    <div className="flex min-w-0 flex-col gap-2">
                      <SupplierQuoteHeading
                        name={
                          quote.supplier_information?.suppliers_legal_name?.trim() ||
                          "Proveedor"
                        }
                        isBestPrice={bestPriceId === quote.quotation_id}
                        isBestWarranty={bestWarrantyId === quote.quotation_id}
                        isBestDelivery={bestDeliveryId === quote.quotation_id}
                        isBestOption={Boolean(quote.is_best_option)}
                      />
                      <QuoteAcceptButton
                        isSelected={isSelected}
                        isAccepting={isAccepting}
                        accountingReviewStatus={accountingReviewStatus}
                        onAccept={() => onRequestAccept(itemId, quote)}
                      />
                    </div>
                    <QuoteQuotationAttachments
                      images={quote.images}
                      documents={quote.documents}
                    />
                  </div>
                );
              })}
              <EmptyQuoteCells count={emptyCount} />

              <div className="contents">
                <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-500 dark:border-slate-700/60 dark:bg-[#1e2229] dark:text-slate-400 xl:px-4">
                  <Layers className="h-3.5 w-3.5 shrink-0" />
                  <span className="leading-snug">Catálogo</span>
                </div>
                {chunk.map((quote, quoteIndex) => {
                  const isSelected =
                    selectedQuotationId === quote.quotation_id ||
                    quote.is_accepted_for_purchase;
                  const isLastFilled = quoteIndex === chunk.length - 1;
                  return (
                    <div
                      key={`${quote.quotation_id}-catalog`}
                      className={`border-t border-l border-slate-200 px-3 py-2.5 text-sm ${TEXT_WRAP_CLASS} text-slate-700 dark:border-slate-700/60 dark:text-slate-200 xl:px-4 ${
                        isLastFilled
                          ? "border-r border-slate-200 dark:border-slate-700/60"
                          : ""
                      } ${
                        isSelected
                          ? "bg-blue-50/40 dark:bg-blue-500/5"
                          : "bg-white dark:bg-[#1e2229]"
                      }`}
                    >
                      <CatalogPriceRow
                        quote={quote}
                        supplierProducts={catalogProducts}
                      />
                    </div>
                  );
                })}
                <EmptyQuoteCells count={emptyCount} />
              </div>

              {COMPARISON_ROWS.map((row, rowIndex) => {
                const Icon = row.icon;
                const zebra =
                  rowIndex % 2 === 0
                    ? "bg-slate-50 dark:bg-[#232830]"
                    : "bg-white dark:bg-[#1e2229]";

                return (
                  <div key={`${chunkIndex}-${row.key}`} className="contents">
                    <div
                      className={`flex items-center gap-2 border-t border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-500 dark:border-slate-700/60 dark:text-slate-400 xl:px-4 ${zebra}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="leading-snug">{row.label}</span>
                    </div>
                    {chunk.map((quote, quoteIndex) => {
                      const isSelected =
                        selectedQuotationId === quote.quotation_id ||
                        quote.is_accepted_for_purchase;
                      const isLastFilled = quoteIndex === chunk.length - 1;
                      return (
                        <div
                          key={`${quote.quotation_id}-${row.key}`}
                          className={`border-t border-l border-slate-200 px-3 py-2.5 text-sm ${TEXT_WRAP_CLASS} dark:border-slate-700/60 xl:px-4 ${
                            isLastFilled
                              ? "border-r border-slate-200 dark:border-slate-700/60"
                              : ""
                          } ${zebra} ${
                            isSelected ? "bg-blue-50/40 dark:bg-blue-500/5" : ""
                          } ${
                            row.emphasize
                              ? "font-semibold text-slate-900 dark:text-white"
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {row.getValue(quote, catalogProducts)}
                        </div>
                      );
                    })}
                    <EmptyQuoteCells count={emptyCount} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
