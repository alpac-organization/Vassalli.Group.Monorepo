import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";

export interface IVacationsServices {
  GetVacations(
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsListResponse>;
}
