import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";

export interface CategoryInformation {
  code: string;
  name: string;
  category_id: string;
}

export interface ProductInformation {
  product_id:   string;
  product_name: string;
  description:  string | null;
  product_usage_type:   ProductUsageTypeEnum;
  category_information: CategoryInformation;
}

export interface CostCenterInformation {
  cost_center_id: string;
  description: string | null;
  cost_center_name: string;
  coil_code: number;
  cost_center_code: string;
}

export interface InventoryStockData {
  minimum_stock: number;
  maximum_stock: number;
  available_quantity: number;
  product_stock_id: string;
  product_information: ProductInformation;
  cost_center_information: CostCenterInformation;
}

export interface PagedResponseStock<T> {
   data:             T[];
   in_minimum_stock: number;
   page_number:      number;
   page_size:        number;
   total:            number;
}