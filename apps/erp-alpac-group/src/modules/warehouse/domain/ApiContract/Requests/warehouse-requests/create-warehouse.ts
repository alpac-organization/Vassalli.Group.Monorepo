export interface CreateWarehouseRequest {
  company_id: string;
  module_code: string;
  code: string;
  branch_id: string;
  is_owner: boolean;
  warehouse_name: string;
  warehouse_type: string;
  parent_warehouse_id?: string | null;
  warehouse_details: WarehouseDetails;
}
export interface WarehouseDetails {
  width_metres?: number;
  length_metres?: number;
  ramps_count?: number;
  parking_spaces_count?: number;
}
