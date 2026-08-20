export interface GenerateExitAccessControlRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  exit_vehicle: boolean;
  exit_container: boolean;
  exit_date?: string;
  exit_time?: string;
}
