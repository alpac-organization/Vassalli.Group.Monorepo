import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export type VacationReportType = "VacationAccrual" | "VacationRequest";

export interface ControlVacationHistoryRequest extends BaseRequest {
  type: VacationReportType;
  branch_id?: string;
  work_area_id?: number;
  identification_number?: string;
  page_size?: number;
  page_number?: number;
}