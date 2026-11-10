import { useState } from "react";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";
import { AnalyzedQuoteProductAccordionRow } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-product-accordion-row";
import { AnalyzedQuoteProductRowGrid } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-product-fields";
import { COLUMN_HEADERS } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.styles";
import type { AnalyzedQuoteProductsListProps } from "./analyzed-quote-products-list.types";
import { getAcceptedSupplierId } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.utils";

const EmptyProductsMessage = ({ productsCount }: { productsCount: number }) => {
  if (productsCount > 0) return null;
  return (
    <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
      No hay productos registrados.
    </div>
  );
};

export const AnalyzedQuoteProductsList = ({
  products,
  onViewImages,
}: AnalyzedQuoteProductsListProps) => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const toggleRow = (rowKey: string) => {
    setOpenRows((current) => ({
      ...current,
      [rowKey]: !current[rowKey],
    }));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-700">
      <div className="min-w-0 sm:min-w-[56rem]">
        <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-7 sm:gap-x-3 dark:border-neutral-700 dark:bg-neutral-800">
          {COLUMN_HEADERS.map((header) => (
            <div
              key={header}
              className="min-w-0 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {header}
            </div>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
          <EmptyProductsMessage productsCount={products.length} />
          {products.length > 0
            ? products.map((product, index) => {
                const productImages = extractPurchaseRequestItemImages(
                  product.additional_data,
                );
                const productName =
                  product.product_details?.product_name?.trim() || "producto";
                const acceptedSupplierId = getAcceptedSupplierId(product);
                const rowKey = `${product.purchase_request_item_id}-${product.product_details?.product_id ?? index}-${index}`;
                const isOpen = Boolean(openRows[rowKey]);
                const onToggle = () => toggleRow(rowKey);

                if (acceptedSupplierId) {
                  return (
                    <AnalyzedQuoteProductAccordionRow
                      key={rowKey}
                      rowKey={rowKey}
                      product={product}
                      productName={productName}
                      productImages={productImages}
                      acceptedSupplierId={acceptedSupplierId}
                      isOpen={isOpen}
                      onToggle={onToggle}
                      onViewImages={onViewImages}
                    />
                  );
                }

                return (
                  <div key={rowKey}>
                    <div className="sm:hidden">
                      <AnalyzedQuoteProductAccordionRow
                        rowKey={rowKey}
                        product={product}
                        productName={productName}
                        productImages={productImages}
                        isOpen={isOpen}
                        onToggle={onToggle}
                        onViewImages={onViewImages}
                      />
                    </div>
                    <div className="hidden px-3 py-3 sm:block">
                      <AnalyzedQuoteProductRowGrid
                        product={product}
                        productName={productName}
                        productImages={productImages}
                        onViewImages={onViewImages}
                      />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};
