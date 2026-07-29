import type { GetProductCategoryResponse } from "../product-category/get-product-category.response";

export interface GetProductResponse {
   product_id: string;
   product_name: string;
   description: string;
   category_id: string;
   usage_type: string;
   category: GetProductCategoryResponse;
}



