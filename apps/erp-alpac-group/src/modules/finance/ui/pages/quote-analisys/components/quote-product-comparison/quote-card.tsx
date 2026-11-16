import { Layers } from "lucide-react";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import { QuoteQuotationAttachments } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-quotation-attachments/quote-quotation-attachments";
import type {
  PurchaseRequestProductQuotation,
  PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { COMPARISON_ROWS } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison-rows";
import { TEXT_WRAP_CLASS } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison.constants";
import { QuoteAcceptButton } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-accept-button";
import { SupplierQuoteHeading } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/recommendation-badges";
import { CatalogPriceRow } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/supplier-catalog-panel";

export type QuoteCardProps = {
  quote: PurchaseRequestProductQuotation;
  isSelected: boolean;
  isBestPrice: boolean;
  isBestWarranty: boolean;
  isBestDelivery: boolean;
  isAccepting?: boolean;
  onAccept: () => void;
  accountingReviewStatus: accountingReviewStatusType;
  supplierProducts?: PurchaseRequestSupplierProduct[];
};

export function QuoteCard({
  quote,
  isSelected,
  isBestPrice,
  isBestWarranty,
  isBestDelivery,
  isAccepting,
  onAccept,
  accountingReviewStatus,
  supplierProducts,
}: QuoteCardProps) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-500/10"
          : "border-slate-200 bg-white dark:border-slate-700/60 dark:bg-[#1e2229]"
      }`}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <SupplierQuoteHeading
          name={
            quote.supplier_information?.suppliers_legal_name?.trim() ||
            "Proveedor"
          }
          isBestPrice={isBestPrice}
          isBestWarranty={isBestWarranty}
          isBestDelivery={isBestDelivery}
          isBestOption={Boolean(quote.is_best_option)}
        />
        <QuoteAcceptButton
          isSelected={isSelected}
          isAccepting={isAccepting}
          onAccept={onAccept}
          accountingReviewStatus={accountingReviewStatus}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-2 dark:bg-[#232830]">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Layers className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Catálogo</span>
          </span>
          <span
            className={`max-w-[58%] ${TEXT_WRAP_CLASS} text-right text-sm text-slate-700 dark:text-slate-200`}
          >
            <CatalogPriceRow
              quote={quote}
              supplierProducts={supplierProducts}
            />
          </span>
        </div>
        {COMPARISON_ROWS.map((row, rowIndex) => {
          const Icon = row.icon;
          const zebra =
            rowIndex % 2 === 0
              ? "bg-transparent"
              : "bg-slate-50 dark:bg-[#232830]";
          const valueClassName = `${TEXT_WRAP_CLASS} text-sm ${
            row.emphasize
              ? "font-semibold text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-200"
          }`;

          if (row.stackOnCard) {
            return (
              <div
                key={row.key}
                className={`flex flex-col gap-1.5 rounded-md px-2.5 py-2 ${zebra}`}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0">{row.label}</span>
                </span>
                <span className={`${valueClassName} text-left`}>
                  {row.getValue(quote, supplierProducts)}
                </span>
              </div>
            );
          }

          return (
            <div
              key={row.key}
              className={`flex items-start justify-between gap-3 rounded-md px-2.5 py-2 ${zebra}`}
            >
              <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{row.label}</span>
              </span>
              <span className={`max-w-[58%] ${valueClassName} text-right`}>
                {row.getValue(quote, supplierProducts)}
              </span>
            </div>
          );
        })}
      </div>

      <QuoteQuotationAttachments
        images={quote.images}
        documents={quote.documents}
      />
    </div>
  );
}
