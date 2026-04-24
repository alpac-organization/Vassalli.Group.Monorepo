import type { ControlVacationGenerateTableReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacation-generate-docs-request";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";
import type { GetReportVacationDocResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/get-report-vacation.doc";

export interface IVacationsServices {
  GetVacations(
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsListResponse>;

  generateVacationTableReport(
    payload: ControlVacationGenerateTableReportRequest,
  ): Promise<GetReportVacationDocResponse>;
}
