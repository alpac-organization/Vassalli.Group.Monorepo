import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetRackDetailRequest extends BaseRequest {
  rack_id: string;
}
