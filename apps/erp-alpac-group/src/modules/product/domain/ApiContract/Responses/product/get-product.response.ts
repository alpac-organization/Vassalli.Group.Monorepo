import type { GetProductCategoryResponse } from "../product-category/get-product-category.response";

export interface GetProductResponse {
   product_id: string;
   product_name: string;
   description: string;
   category_id: string;
   category: GetProductCategoryResponse;
}

export interface GetProductResponseList {
   data: GetProductResponse[];
   page_number: number;
   page_size: number;
   total: number;
}