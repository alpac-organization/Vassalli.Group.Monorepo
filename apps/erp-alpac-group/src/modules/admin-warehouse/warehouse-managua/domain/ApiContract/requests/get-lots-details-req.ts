import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetLotDetailRequest extends BaseRequest {
  section_id: string;
  lot_id: string;
}
