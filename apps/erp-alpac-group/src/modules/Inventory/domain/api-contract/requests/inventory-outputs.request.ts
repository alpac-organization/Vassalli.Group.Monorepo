import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";

export interface InventoryOutputsRequest extends BaseRequest {
  output_code?: string;
  status?: InventoryOutputsStatus | null;
  request_type?: string;
  supply_request_code?: string;
  fuel_request_code?: string;
  reason_inventory_removal_id?: string;

  page_number?: number;
  page_size?: number;
}

export interface GetInventoryOutputDetailRequest extends BaseRequest {
  inventory_output_id: string;
}