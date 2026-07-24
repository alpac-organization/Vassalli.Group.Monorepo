import { cleanParams } from "@app/shared/utils/object.utils";
import type { IHttpHandler } from "@app/core/ports";
import type { IProductServices } from "../../application/interfaces/IProductServices";
import type { GetProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/get-product-category.request";

export class ProductServices implements IProductServices {

   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async GetProductCategories(payload: GetProductCategoryRequest): Promise<any> {
      try {
         const { company_id, module_code, ...queryParams } = payload;

         const url = `companies/${company_id}/modules/${module_code}/category-products`;

         const response = await this.apiHandler.get<any>(url, { params: cleanParams(queryParams) });         

         return response;
      } catch (error) {
         throw error;
      }
   }
}