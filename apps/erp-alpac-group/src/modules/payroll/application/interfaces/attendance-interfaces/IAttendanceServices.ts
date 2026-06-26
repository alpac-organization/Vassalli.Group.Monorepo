import type { GetAttendanceRecordsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/attendance-requests/get-attendance-records.request";
import type { GetAttendanceRecordsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";

export interface IAttendanceServices {
  GetAttendanceRecordsAsync(
    payload: GetAttendanceRecordsRequest,
  ): Promise<GetAttendanceRecordsResponse>;
}
