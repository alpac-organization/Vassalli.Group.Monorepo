import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";

export interface InventoryOutputDto {
  inventory_output_id: string;
  output_code: string;
  observations?: string | null;
  status: InventoryOutputsStatus;
  request_code?: string | null;
  request_type?: string | null;
  reasons_inventory_removal_description?: string | null;
  work_area_name?: string | null;
  cost_center_name?: string | null;
  request_date?: string | null;
}

export interface PagedInventoryOutputsResponse {
  data: InventoryOutputDto[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface InventoryOutputDetailStockInformation {
  inventory_stock_id: string;
  product_id: string;
  available_quantity: number;
  weighted_average_cost: number;
  status?: string | null;
  unit_measure_id: string;
}

export interface InventoryOutputSupplyRequestDetail {
  supply_request_id?: string | null;
  supply_request_code?: string | null;
  po_code?: string | null;
  reason_use?: string | null;
  justification?: string | null;
  outflow_status?: string | null;
  requested_by_user_name?: string | null;
  created_at?: string | null;
  warehouse_information?: { code?: string | null } | null;
  operational_order_information?: { po_code?: string | null; packages_count?: number | null } | null;
  approved_by_user_chief_name?: string | null;
  annulled_by_user_chief_name?: string | null;
  items?: Array<{
    supply_request_item_id: string;
    product_stock_id?: string | null;
    product_stock_name?: string | null;
    amount: number;
  }> | null;
  warehouse_code?: string | null;
  work_area_name?: string | null;
}

export interface InventoryOutputFuelRequestDetail {
  fuel_request_id?: string | null;
  fuel_request_code?: string | null;
  outflow_status?: string | null;
  requested_by_user_name?: string | null;
  created_at?: string | null;
  machinery_code?: string | null;
  machinery_brand?: string | null;
  machinery_model?: string | null;
  machinery_information?: {
    code?: string | null;
    brand?: string | null;
    year?: string | null;
    model?: string | null;
    serial_number?: string | null;
    color?: string | null;
    status?: string | null;
    type?: string | null;
  } | null;
  product_stock_id?: string | null;
  product_stock_name?: string | null;
  requested_quantity?: number | null;
  mileage?: number | null;
  engine_hours?: number | null;
  approved_by_user_chief_name?: string | null;
  annulled_by_user_chief_name?: string | null;
  justification?: string | null;
  work_area_information?: { work_area_name?: string | null } | null;
}

export interface InventoryOutputDetailDto {
  supply_request_detail?: InventoryOutputSupplyRequestDetail | null;
  fuel_request_detail?: InventoryOutputFuelRequestDetail | null;
  inventory_stock_informations?: InventoryOutputDetailStockInformation[] | null;
  dispatched_by_user_name?: string | null;
  dispatched_at?: string | null;
  dispatched_justification?: string | null;
}