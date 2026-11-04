import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSupplyRequestDetailRequest extends BaseRequest {
  supply_request_id: string;
}
