import type { IHttpHandler } from "@app/core/ports";
import type { IVacationsServices } from "@app/modules/payroll/application/interfaces/IVacationServices";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { ControlVacationGenerateRequest } from "../../domain/ApiContract/Requests/vacation-generate-request";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
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
      const vacations = this.apiHandler.get<GetVacationsListResponse>(
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
  public async generateControlVacationDocument(
    payload: ControlVacationGenerateRequest,
  ): Promise<void> {
    const { company_id, module_code } = payload;
    const response = this.apiHandler.get<void>(
      `/companies/${company_id}/modules/${module_code}/vacations/generate-document`,
    );
    return response;
  }
}
