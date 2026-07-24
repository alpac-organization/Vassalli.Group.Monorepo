export interface GetAccessControlResponse {
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
  data: RecordEntrance[];
  stats: AccessControlStatsResponse;
}

export interface AccessControlStatsResponse {
  total_entries: number;
  total_on_site: number;
  total_exits: number;
}

export interface RecordEntrance {
  id: string;
  status: string;
  is_consolidated: boolean;
  reception_entrance: ReceptionEntrance;
  execution_log: ExecutionLog;
  ducats: Ducat[];
}

export interface ReceptionEntrance {
  id: string;
  country_of_origin: string;
  aduana: string;
  driver_name: string;
  plate_number: string;
  trailer_chassis: string;
  driver_license: string;
  transportista: string;
  medio: string;
  consignee: string;
  seal_number: string;
  updated_by_user_name: string | null;
  updated_date: string | null;
  updated_time: string | null;
  medio_exit_date: string | null;
  medio_exit_time: string | null;
}

export interface ExecutionLog {
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  processed_by_user_name: string;
  duration_total_seconds: number;
  duration_formatted: string;
}

export interface Ducat {
  id: string;
  ducat_number: string;
}

export type DataAccessControl = RecordEntrance;
