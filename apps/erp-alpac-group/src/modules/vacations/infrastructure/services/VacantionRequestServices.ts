import type { IHttpHandler } from "@app/core/ports";
import type { IVacationRequestServices } from "@app/modules/vacations/application/interfaces/IVacationRequestServices";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";

export class VacationServices implements IVacationRequestServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async createVacationRequest(
    payload: CreateVacationRequest,
  ): Promise<void> {
    const { company_id, module_code, identification_number, ...body } = payload;
    const response = await this.apiHandler.post<void>(
      `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/vacation-requests`,
      body,
    );
    return response;
  }
}
