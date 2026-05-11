export type VacationReportType = "VacationAccrual" | "VacationRequest";

export interface ControlVacationHistoryRequest {
  company_id: string;
  module_code: string;
  type: VacationReportType;
  branch_id?: string;
  work_area_id?: number;
  identification_number?: string;
  page_size?: number;
  page_number?: number;
}