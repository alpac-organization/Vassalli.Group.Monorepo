import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterLotRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  quantity: number;
  nominal_rows: number;
  nominal_columns: number;
  width: number;
  length: number;
}