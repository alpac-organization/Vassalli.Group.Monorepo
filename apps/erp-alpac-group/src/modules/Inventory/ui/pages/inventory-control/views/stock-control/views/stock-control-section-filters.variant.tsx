import type { Option } from "@alpac/design-system";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";

export const GetProductCategoryOptions = function(data: GetProductCategoryResponse[]): Option[] {
   return data?.map(category =>  {
      return {
         label: category.name,
         value: category.id,
         disabled: false
      }
   });
}