import type { CategoryType } from "@app/modules/product/domain/enums/category-type.enum";

interface ProductCategory {
  category_id: string;
  name: string;
  code: string;
  is_active: boolean;
  category_type: CategoryType;
  is_service: boolean;
}

export interface GetProductCategoryResponse extends ProductCategory {
  sub_category: ProductCategory[];
}
