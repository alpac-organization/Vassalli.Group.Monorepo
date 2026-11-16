import { Button } from "@alpac/design-system";
import { ImagesIcon } from "lucide-react";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";
import { viewImagesButtonClass } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/utils/styles.purchasing";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { AnalyzedQuoteProductsListProps } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.types";
import {
  cellValueClassName,
  cellValueMediumClassName,
  mobileLabelClassName,
} from "./analyzed-quote-products-list.styles";
import {
  resolveCategoryLabel,
  resolveNullableLabel,
  resolveUnitMeasureLabel,
} from "./analyzed-quote-products-list.utils";

export type AnalyzedQuoteProductFieldsProps = {
  product: PurchaseRequestProductInformation;
  productName: string;
  productImages: ReturnType<typeof extractPurchaseRequestItemImages>;
  onViewImages: AnalyzedQuoteProductsListProps["onViewImages"];
};

export const AnalyzedQuoteProductNameCell = ({
  product,
}: {
  product: PurchaseRequestProductInformation;
}) => (
  <>
    <span className={mobileLabelClassName}>Producto</span>
    <span className={cellValueMediumClassName}>
      {resolveNullableLabel(product.product_details?.product_name)}
    </span>
  </>
);

export const AnalyzedQuoteProductBodyFields = ({
  product,
  productName,
  productImages,
  onViewImages,
}: AnalyzedQuoteProductFieldsProps) => (
  <>
    <span className={mobileLabelClassName}>Descripción</span>
    <span className={cellValueClassName}>
      {resolveNullableLabel(product.description)}
    </span>

    <span className={mobileLabelClassName}>Cantidad</span>
    <span className={cellValueClassName}>
      {product.quantity}
      {product.quantity_unit != null ? ` × ${product.quantity_unit}` : ""}
    </span>

    <span className={mobileLabelClassName}>Unidad</span>
    <span className={cellValueClassName}>
      {resolveUnitMeasureLabel(product.unit_measure_information)}
    </span>

    <span className={mobileLabelClassName}>Categoría</span>
    <span className={cellValueClassName}>
      {resolveCategoryLabel(product.product_details)}
    </span>

    <span className={mobileLabelClassName}>Justificación</span>
    <span className={cellValueClassName}>
      {resolveNullableLabel(product.justification)}
    </span>

    <span className={mobileLabelClassName}>Imágenes</span>
    {productImages.length > 0 ? (
      <div className="min-w-0">
        <Button
          type="button"
          size="small"
          label="Ver imágenes"
          icon={<ImagesIcon size={16} />}
          className={viewImagesButtonClass}
          onClick={(event) => {
            event.stopPropagation();
            onViewImages({
              productName,
              images: productImages,
            });
          }}
        />
      </div>
    ) : (
      <span className={cellValueClassName}>—</span>
    )}
  </>
);

export const AnalyzedQuoteProductRowGrid = ({
  product,
  productName,
  productImages,
  onViewImages,
}: AnalyzedQuoteProductFieldsProps) => (
  <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-7 sm:items-start sm:gap-x-3">
    <AnalyzedQuoteProductNameCell product={product} />
    <AnalyzedQuoteProductBodyFields
      product={product}
      productName={productName}
      productImages={productImages}
      onViewImages={onViewImages}
    />
  </div>
);
