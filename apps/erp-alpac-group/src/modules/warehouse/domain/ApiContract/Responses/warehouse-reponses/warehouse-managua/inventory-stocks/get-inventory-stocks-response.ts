import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { InventoryStockStatusEnum } from "@app/core/enums/inventory-stock-status.enum";
import type {
  CostCenterInformation,
  UnitMeasureInformation,
} from "@app/shared/interfaces/organization-information/organization-information";

export interface InventoryStockProductInformation {
  product_id: string;
  product_code?: string | null;
  product_name?: string | null;
  description?: string | null;
  product_usage_type?: number | null;
}

export interface InventoryStockDto {
  minimum_stock: number;
  maximum_stock: number | null;
  product_stock_id: string;
  available_quantity: number;
  weighted_average_cost: number;
  status: InventoryStockStatusEnum;
  product_information?: InventoryStockProductInformation | null;
  cost_center_information?: CostCenterInformation | null;
  unit_measure_information?: UnitMeasureInformation | null;
}

export interface GetInventoryStocksResponse
  extends PaginateBaseResponse<InventoryStockDto> {
  in_minimum_stock: number;
}
