import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetLotCapacitiesRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  lot_id: string;
}
