import type { AttendanceRecordDto } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";

export type AttendanceControlTableProps = {
  data: AttendanceRecordDto[];
  pagination?: React.ReactNode;
  onSelect: (attendance: AttendanceRecordDto) => void;
};
