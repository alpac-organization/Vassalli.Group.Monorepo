import type { CategoryType } from "@app/modules/product/domain/enums/category-type.enum";

export interface GetProductCategoryRequest {
   company_id: string;
   module_code: string;
   category_type?: CategoryType;
}