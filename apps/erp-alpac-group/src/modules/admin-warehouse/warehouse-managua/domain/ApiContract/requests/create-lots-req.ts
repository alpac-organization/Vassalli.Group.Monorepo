import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterLotRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  code: string;
  width_metres: number;
  length_metres: number;
}