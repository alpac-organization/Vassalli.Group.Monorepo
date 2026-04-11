import type { IHttpHandler } from "@app/core/ports";
import type { IVacationsServices } from "@app/modules/payroll/application/interfaces/IVacationServices";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { ControlVacationGenerateRequest } from "../../domain/ApiContract/Requests/vacation-generate-request";
export class ControlVacationServices implements IVacationsServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }
  public async GetVacations(
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsHistoryResponse[]> {
    try {
      const { company_id, module_code, ...rest } = payload;
      const response = this.apiHandler.get<GetVacationsHistoryResponse[]>(
        `/companies/${payload.company_id}/modules/${payload.module_code}/vacations`,
        {
          params: cleanParams(rest),
        },
      );
      return response;
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
