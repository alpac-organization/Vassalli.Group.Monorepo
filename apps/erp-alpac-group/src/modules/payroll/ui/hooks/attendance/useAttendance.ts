import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { AttendanceServices } from "@app/modules/payroll/infrastructure/services/attendance-services/AttendanceServices";
import type { GetAttendanceRecordsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/attendance-requests/get-attendance-records.request";
import type { GetAttendanceRecordsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const attendanceServices = new AttendanceServices(httpHandler);

export const useAttendance = () => {
  const useGetAttendanceRecords = (
    payload: GetAttendanceRecordsRequest,
    options?: { enabled?: boolean },
  ) => {
    return useQuery<GetAttendanceRecordsResponse, ApiErrorResponse>({
      queryKey: [
        "attendanceRecords",
        payload.companie_id,
        payload.module_code,
        payload.start_date,
        payload.end_date,
        payload.identification_number,
        payload.page_number,
        payload.page_size,
      ],
      queryFn: () =>
        attendanceServices.GetAttendanceRecordsAsync(payload),
      enabled: options?.enabled,
    });
  };

  return {
    useGetAttendanceRecords,
  };
};
