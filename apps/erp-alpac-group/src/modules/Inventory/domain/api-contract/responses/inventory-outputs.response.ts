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
  work_area_information?: { work_area_name?: string | null } | null;
  cost_center_information?: { cost_center_name?: string | null; cost_center_code?: string | number | null } | null;
  branch_information?: { branch_name?: string | null; branch_code?: string | null } | null;
  equipment_information?: {
    code?: string | null;
    brand?: string | null;
    model?: string | null;
    serial_number?: string | null;
    type?: string | null;
  } | null;
  customer_information?: { legal_name?: string | null } | null;
  duca_or_transport_order?: string | null;
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
  equipment_information?: {
    code?: string | null;
    brand?: string | null;
    model?: string | null;
    serial_number?: string | null;
    type?: string | null;
  } | null;
  cost_center_information?: { cost_center_name?: string | null; cost_center_code?: string | number | null } | null;
  branch_information?: { branch_name?: string | null; branch_code?: string | null } | null;
  warehouse_information?: { code?: string | null } | null;
  product_stock_id?: string | null;
  product_stock_name?: string | null;
  requested_quantity?: number | null;
  unit_measure_symbol?: string | null;
  requested_quantity_litters?: number | null;
  customer_information?: {
    customer_id?: string | null;
    cif?: string | null;
    legal_name?: string | null;
    identification_number?: string | null;
    identification_type?: string | null;
  } | null;
  mileage?: number | null;
  engine_hours?: number | null;
  previous_mileage?: number | null;
  previous_engine_hours?: number | null;
  approved_by_user_chief_name?: string | null;
  annulled_by_user_chief_name?: string | null;
  justification?: string | null;
  work_area_information?: { work_area_name?: string | null } | null;
}

export interface InventoryOutputKardexMovement {
  kardex_id?: string | null;
  kardex_type?: string | null;
  movement_type?: string | null;
  units?: number | null;
  total_units?: number | null;
  unit_cost?: number | null;
  total_input?: number | null;
  total_output?: number | null;
  average_cost?: number | null;
  total_kardex?: number | null;
  product_information?: {
    product_id?: string | null;
    product_code?: string | null;
    product_name?: string | null;
    description?: string | null;
  } | null;
  unit_measure_information?: {
    name?: string | null;
    symbol?: string | null;
  } | null;
}

export interface InventoryOutputDetailDto {
  supply_request_detail?: InventoryOutputSupplyRequestDetail | null;
  fuel_request_detail?: InventoryOutputFuelRequestDetail | null;
  inventory_stock_informations?: InventoryOutputDetailStockInformation[] | null;
  kardex_movements?: InventoryOutputKardexMovement[] | null;
  dispatched_by_user_name?: string | null;
  dispatched_at?: string | null;
  dispatched_justification?: string | null;
}