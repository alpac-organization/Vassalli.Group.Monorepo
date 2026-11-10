import { m } from "framer-motion";
import { ChevronDown, Package } from "lucide-react";
import { type KeyboardEvent } from "react";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { AnalyzedQuoteProductQuotations } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-product-quotations";
import type { AnalyzedQuoteProductsListProps } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.types";
import { accordionPanelTransition } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.styles";
import {
  AnalyzedQuoteProductBodyFields,
  AnalyzedQuoteProductNameCell,
  AnalyzedQuoteProductRowGrid,
} from "./analyzed-quote-product-fields";
import { AnalyzedQuoteSelectedSupplierDetails } from "./analyzed-quote-selected-supplier-details";

type AnalyzedQuoteProductAccordionRowProps = {
  rowKey: string;
  product: PurchaseRequestProductInformation;
  productName: string;
  productImages: ReturnType<typeof extractPurchaseRequestItemImages>;
  acceptedSupplierId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onViewImages: AnalyzedQuoteProductsListProps["onViewImages"];
};

export const AnalyzedQuoteProductAccordionRow = ({
  rowKey,
  product,
  productName,
  productImages,
  acceptedSupplierId,
  isOpen,
  onToggle,
  onViewImages,
}: AnalyzedQuoteProductAccordionRowProps) => {
  const panelId = `${rowKey}-panel`;
  const triggerId = `${rowKey}-trigger`;

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  const quotationPanel =
    acceptedSupplierId != null ? (
      <>
        <AnalyzedQuoteProductQuotations
          quotations={product.quotations ?? []}
          supplierProducts={product.product_details?.supplier_products}
        />
        {isOpen ? (
          <AnalyzedQuoteSelectedSupplierDetails
            supplierId={acceptedSupplierId}
          />
        ) : null}
      </>
    ) : null;

  return (
    <div className="flex flex-col">
      <div
        id={triggerId}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-3 text-left outline-none transition-colors duration-200 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-inset dark:hover:bg-white/5"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:hidden">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 ring-1 ring-slate-200 dark:text-slate-300 dark:ring-neutral-600">
            <Package size={18} aria-hidden />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <AnalyzedQuoteProductNameCell product={product} />
          </div>
        </div>
        <div className="hidden min-w-0 flex-1 sm:block">
          <AnalyzedQuoteProductRowGrid
            product={product}
            productName={productName}
            productImages={productImages}
            onViewImages={onViewImages}
          />
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:text-slate-400 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden
        />
      </div>

      <m.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        initial={false}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={accordionPanelTransition}
        style={{ overflow: "hidden" }}
      >
        <div className="min-h-0">
          <div className="grid grid-cols-1 gap-6 px-3 pb-3 sm:hidden">
            <AnalyzedQuoteProductBodyFields
              product={product}
              productName={productName}
              productImages={productImages}
              onViewImages={onViewImages}
            />
          </div>
          {quotationPanel}
        </div>
      </m.div>
    </div>
  );
};
