import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeleteRackRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  rack_id: string;
}
