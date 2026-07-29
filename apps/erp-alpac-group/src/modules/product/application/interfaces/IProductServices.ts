import type { GetProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/get-product-category.request";
import type { GetProductRequest } from "../../domain/ApiContract/Requests/product/get-product.request";
import type { GetProductCategoryResponse } from "../../domain/ApiContract/Responses/product-category/get-product-category.response";
import type { GetProductResponse } from "../../domain/ApiContract/Responses/product/get-product.response";

export interface IProductServices {
   
  GetProductCategories(payload: GetProductCategoryRequest): Promise<GetProductCategoryResponse>;

  GetProducts(payload: GetProductRequest): Promise<GetProductResponse>;
}
