export interface GetAccessControlResponse {
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
  data: DataAccessControl[];
}
export interface DataAccessControl {
  record_entrance_id: string;
  status: string;
  current_step_code: string;
  is_consolidated: boolean;
  created_at: string;
  reception_start_date: string;
  reception_start_time: string;
  reception_end_date: string;
  reception_end_time: string;
  duration_total_seconds: number;
  driver_name: string;
  plate_number: string;
  transportista: string;
  ducat_numbers: string[];
}
