interface ProductCategory {  
  name: string;
  code: string;
  is_active: boolean;
}

export interface GetProductCategoryResponse extends ProductCategory {  
  sub_category: ProductCategory[];
}
