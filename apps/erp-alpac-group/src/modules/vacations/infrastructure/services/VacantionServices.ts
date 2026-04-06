import type { IHttpHandler } from "@app/core/ports";
import type { IVacationRequestServices } from "@app/modules/vacations/application/interfaces/IVacationServices";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";
import type { VacationHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import type { VacationHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-history-response";
import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
import { cleanParams } from "@app/shared/utils/object.utils";
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

  public async getVacationSaldo(
    payload: GetVacationSaldoRequest,
  ): Promise<GetVacationSaldoResponse> {
    const { company_id, module_code, identification_number } = payload;
    const response = await this.apiHandler.get<GetVacationSaldoResponse>(
      `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/vacations`,
    );
    return response;
  }
  public async getVacationHistory(
    payload: VacationHistoryRequest,
  ): Promise<VacationHistoryResponse[]> {
    const { companie_id, module_code, identification_number, ...queryParams } =
      payload;
    const response = await this.apiHandler.get<VacationHistoryResponse[]>(
      `/companies/${companie_id}/modules/${module_code}/collaborators/${identification_number}/vacation-requests`,
      {
        params: cleanParams(queryParams),
      },
    );
    console.log(response);
    return response;
  }
}
