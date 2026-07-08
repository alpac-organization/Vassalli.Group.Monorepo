import type { AttendanceRecordDto } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";

export type AttendanceControlDetailProps = {
    isOpen:  boolean;
    onClose?: () => void;
    attendanceDetail?: AttendanceRecordDto['markings'];
}