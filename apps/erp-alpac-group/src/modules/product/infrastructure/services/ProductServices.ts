import { cleanParams } from "@app/shared/utils/object.utils";
import type { IHttpHandler } from "@app/core/ports";
import type { IProductServices } from "../../application/interfaces/IProductServices";
import type { CreateProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/create-product-category.request";
import type { CreateProductCategoryResponse } from "../../domain/ApiContract/Responses/product-category/create-product-category.response";
import type { GetProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/get-product-category.request";
import type { GetProductCategoryResponse } from "../../domain/ApiContract/Responses/product-category/get-product-category.response";
import type { GetProductRequest } from "../../domain/ApiContract/Requests/product/get-product.request";
import type { GetProductResponseList } from "../../domain/ApiContract/Responses/product/get-product.response";
import type { CreateProductRequest } from "../../domain/ApiContract/Requests/product/create-product.request";
import type { CreateProductResponse } from "../../domain/ApiContract/Responses/product/create-product.response";

export class ProductServices implements IProductServices {
  private readonly apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  async GetProductCategories(
    payload: GetProductCategoryRequest,
  ): Promise<GetProductCategoryResponse> {
    try {
      const { company_id, module_code, ...queryParams } = payload;

      const url = `companies/${company_id}/modules/${module_code}/category-products`;

      const response = await this.apiHandler.get<GetProductCategoryResponse>(
        url,
        {
          params: cleanParams(queryParams),
        },
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async GetProducts(payload: GetProductRequest): Promise<GetProductResponseList> {
    try {
      const { company_id, module_code, ...queryParams } = payload;

      const url = `companies/${company_id}/modules/${module_code}/products`;

      const response = await this.apiHandler.get<GetProductResponseList>(url, {
        params: cleanParams(queryParams),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async CreateProduct(payload: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      const { company_id, module_code, ...rest } = payload;

      const url = `companies/${company_id}/modules/${module_code}/products`;

      const response = await this.apiHandler.post<CreateProductResponse>(url, rest);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async CreateProductCategory(payload: CreateProductCategoryRequest): Promise<CreateProductCategoryResponse> {
    try {
      const { company_id, module_code, ...rest } = payload;
      const url = `companies/${company_id}/modules/${module_code}/category-products`;
      const response = await this.apiHandler.post<CreateProductCategoryResponse>(url, rest);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
