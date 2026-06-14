import type { IHttpHandler } from "@app/core/ports";
import type { IAttendanceServices } from "@app/modules/payroll/application/interfaces/attendance-interfaces/IAttendanceServices";
import type { GetAttendanceRecordsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/attendance-requests/get-attendance-records.request";
import type { GetAttendanceRecordsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class AttendanceServices implements IAttendanceServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async GetAttendanceRecordsAsync(
    payload: GetAttendanceRecordsRequest,
  ): Promise<GetAttendanceRecordsResponse> {
    try {
      const { companie_id, module_code, ...queryParams } = payload;
      const url = `/companies/${companie_id}/modules/${module_code}/attendance-records`;
      const response = await this.httpHandler.get<GetAttendanceRecordsResponse>(
        url,
        { params: cleanParams(queryParams) },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
