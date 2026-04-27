import type { GetVacationSaldoRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/vacation-saldo-response";

export interface IVacationServices {
  /**
   * Obtiene el saldo de vacaciones
   * @param payload - Datos de la solicitud de saldo de vacaciones
   * @returns GetVacationSaldoResponse
   */
  getVacationSaldo(
    payload: GetVacationSaldoRequest,
  ): Promise<GetVacationSaldoResponse>;
}
