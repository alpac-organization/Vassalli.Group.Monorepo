import type { IHttpHandler } from "@app/core/ports";
import type { IVacationSaldoServices } from "@app/modules/vacations/application/interfaces/IVacationSaldoServices";
import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
export class VacationSaldoServices implements IVacationSaldoServices {
  private apiHandler: IHttpHandler;
  constructor(IHttpHandler: IHttpHandler) {
    this.apiHandler = IHttpHandler;
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
}
