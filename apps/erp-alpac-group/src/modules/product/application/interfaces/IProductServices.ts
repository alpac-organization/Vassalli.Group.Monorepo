import type { GetProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/get-product-category.request";

export interface IProductServices {
   GetProductCategories(payload: GetProductCategoryRequest): Promise<any>;
}