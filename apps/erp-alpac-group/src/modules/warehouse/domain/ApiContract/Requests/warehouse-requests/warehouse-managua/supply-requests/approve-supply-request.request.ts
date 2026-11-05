import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ApproveSupplyRequestRequest extends BaseRequest {
  supply_request_id: string;
  reason_inventory_removal_id: string;
  observations?: string;
}
