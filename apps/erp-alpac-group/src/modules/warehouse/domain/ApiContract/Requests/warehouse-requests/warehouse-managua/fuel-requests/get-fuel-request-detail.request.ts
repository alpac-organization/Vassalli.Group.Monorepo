import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetFuelRequestDetailRequest extends BaseRequest {
  fuel_request_id: string;
}
