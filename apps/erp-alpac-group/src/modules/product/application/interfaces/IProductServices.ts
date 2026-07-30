import type { GetProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/get-product-category.request";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { GetProductResponseList } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface IProductServices {
   
  GetProductCategories(payload: GetProductCategoryRequest): Promise<GetProductCategoryResponse>;

  GetProducts(payload: GetProductRequest): Promise<GetProductResponseList>;

  CreateProduct(payload: CreateProductRequest): Promise<void>;
}
