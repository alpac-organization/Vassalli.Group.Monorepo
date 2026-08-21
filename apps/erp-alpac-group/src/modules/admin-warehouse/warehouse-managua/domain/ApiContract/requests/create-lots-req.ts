import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterLotGroupRequest {
  codes?: string[] | null;
  code_prefix?: string | null;
  start_number?: number | null;
  count?: number | null;
  width_metres: number;
  length_metres: number;
  nominal_rows: number;
  nominal_columns: number;
  allows_stacking: boolean;
  status: string;
  unavailable_reason?: string | null;
}

export interface CreateLotsRequest extends BaseRequest {
  section_id: string;
  groups: RegisterLotGroupRequest[];
}
