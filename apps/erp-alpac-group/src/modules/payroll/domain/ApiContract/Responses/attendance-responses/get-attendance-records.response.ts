export interface AttendanceRecordDto {
  user_id: number;
  date: string;
  identification_number?: string;
  collaborator_fullname?: string;
  markings: AttendanceLog
}

interface AttendanceLog {
  read_time: string;
  device_name: string;
}

export interface PagedResponseAttendance<T> {
  data: T[];
  page_number: number;
  page_size: number;
  total: number;
}

export type GetAttendanceRecordsResponse =
  PagedResponseAttendance<AttendanceRecordDto>;
