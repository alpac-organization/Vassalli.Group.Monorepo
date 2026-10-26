import type { InventoryStockStatusEnum } from "@app/core/enums/inventory-stock-status.enum";
import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { UnitMeasurementType } from "@app/core/enums/unit-measurements";

export interface CategoryInformation {
  code: string;
  name: string;
  category_id: string;
}

export interface ProductInformation {
  product_id:   string;
  product_code: string;
  product_name: string;
  description:  string | null;
  product_usage_type:   ProductUsageTypeEnum;
  category_information: CategoryInformation;
}

export interface CostCenterInformation {
  cost_center_id:   string;
  description:      string | null;
  coil_code:        number;
  cost_center_name: string;
  cost_center_code: string;
}

export interface UnitMeasureInformation {
  name:   string,
  symbol: string,
  type:   UnitMeasurementType
}

export interface InventoryStockData {
  minimum_stock:       number;
  maximum_stock:       number;
  product_stock_id:    string;
  available_quantity:  number;
  product_information: ProductInformation;
  status:              InventoryStockStatusEnum;
  cost_center_information:  CostCenterInformation;
  unit_measure_information: UnitMeasureInformation;
}

export interface PagedResponseStock<T> {
   data:             T[];
   in_minimum_stock: number;
   page_number:      number;
   page_size:        number;
   total:            number;
}