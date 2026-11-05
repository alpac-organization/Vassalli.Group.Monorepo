import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeclineSupplyRequestRequest extends BaseRequest {
  supply_request_id: string;
  observations?: string;
}
