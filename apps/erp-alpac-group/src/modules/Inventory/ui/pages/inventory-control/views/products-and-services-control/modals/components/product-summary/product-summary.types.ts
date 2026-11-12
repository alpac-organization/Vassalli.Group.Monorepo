import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export type ProductSummaryProps = {
   product?: GetProductResponse | null;
};