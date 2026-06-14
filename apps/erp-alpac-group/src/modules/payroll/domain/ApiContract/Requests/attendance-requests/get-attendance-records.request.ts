export interface GetAttendanceRecordsRequest {
  companie_id: string;
  module_code: string;
  start_date: string;
  end_date: string;
  identification_number?: string;
  page_number?: number;
  page_size?: number;
}
