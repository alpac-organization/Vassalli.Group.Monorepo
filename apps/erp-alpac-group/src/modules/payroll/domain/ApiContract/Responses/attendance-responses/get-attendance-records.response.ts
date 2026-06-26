export interface AttendanceRecordDto {
  attendance_record_id: string;
  collaborator_fullname?: string;
  identification_number?: string;
  record_date: string;
  record_type: string | number;
  device_name?: string;
}

export interface PagedResponseAttendance<T> {
  data: T[];
  page_number: number;
  page_size: number;
  total_records: number;
}

export type GetAttendanceRecordsResponse =
  PagedResponseAttendance<AttendanceRecordDto>;
