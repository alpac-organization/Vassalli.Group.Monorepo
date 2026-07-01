export interface GetAttendanceRecordsRequest {
  companie_id: string;
  start_date: string | null;
  end_date: string | null;
  identification_number?: string;
  page_number?: number;
  page_size?: number;
}
