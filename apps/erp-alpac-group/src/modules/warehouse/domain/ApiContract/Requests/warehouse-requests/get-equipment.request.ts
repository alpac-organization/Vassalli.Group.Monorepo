import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetEquipmentRequest extends BaseRequest {
  page_number?: number;
  page_size?: number;
  type?: string;
  branch_id?: string;
}