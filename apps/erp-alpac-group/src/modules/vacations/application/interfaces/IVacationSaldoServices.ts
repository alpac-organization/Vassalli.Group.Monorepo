import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
export interface IVacationSaldoServices {
  getVacationSaldo(
    payload: GetVacationSaldoRequest,
  ): Promise<GetVacationSaldoResponse>;
}
