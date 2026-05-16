import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export interface IVacationsServices {
  GetVacations(
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsListResponse>;
}
