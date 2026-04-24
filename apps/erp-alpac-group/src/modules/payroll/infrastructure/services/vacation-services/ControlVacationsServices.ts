import type { IHttpHandler } from "@app/core/ports";
import type { IVacationsServices } from "@app/modules/payroll/application/interfaces/vacation-interfaces/IControlVacationServices";
import type { ControlVacationGenerateTableReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacation-generate-docs-request";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { GetReportVacationDocResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/get-report-vacation.doc";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export class ControlVacationServices implements IVacationsServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async GetVacations(
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsListResponse> {
    try {
      const { company_id, module_code, ...rest } = payload;
      const vacations = await this.apiHandler.get<GetVacationsListResponse>(
        `/companies/${company_id}/modules/${module_code}/vacations`,
        {
          params: cleanParams(rest),
        },
      );
      return vacations;
    } catch (error) {
      throw error;
    }
  }
  public async generateVacationTableReport(
    payload: ControlVacationGenerateTableReportRequest,
  ): Promise<GetReportVacationDocResponse> {
    const { company_id, module_code } = payload;
    const response = await this.apiHandler.get<GetReportVacationDocResponse>(
      `/companies/${company_id}/modules/${module_code}/vacations/generate-document`,
    );
    return response;
  }
}
