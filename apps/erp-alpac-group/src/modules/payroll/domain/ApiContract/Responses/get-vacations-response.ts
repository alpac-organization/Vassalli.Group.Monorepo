import type { ControlVacationStatus } from "../Requests/vacation-request";

export interface GetVacationsHistoryResponse {
  id_control_vacation: string;
  full_name: string;
  collaborator_code: string;
  start_date: string;
  end_date: string;
  status: ControlVacationStatus;
  description: string;
  created_at: string;
}

export interface GetCollaboratorsListResponse {
  data: GetVacationsHistoryResponse[];
  total_records: number;
  page_size: number;
  page_number: number;
}
