import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateWarehouseRequest extends BaseRequest {
  code: string;
  branch_id: string;
  is_owner: boolean;
  warehouse_name: string;
  warehouse_type: number;
  parent_warehouse_id?: string | null;
  warehouse_details: WarehouseDetails;
}
export interface WarehouseDetails {
  width_metres?: number;
  length_metres?: number;
  ramps_count?: number;
  parking_spaces_count?: number;
}
