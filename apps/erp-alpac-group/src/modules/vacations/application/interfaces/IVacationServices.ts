import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";
import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
import type { VacationHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import type { VacationHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-history-response";
export interface IVacationRequestServices {
  /**
   * Crea una solicitud de vacaciones
   * @param payload - Datos de la solicitud de vacaciones
   * @returns void
   */
  createVacationRequest(payload: CreateVacationRequest): Promise<void>;

  /**
   * Obtiene el saldo de vacaciones
   * @param payload - Datos de la solicitud de saldo de vacaciones
   * @returns GetVacationSaldoResponse
   */
  getVacationSaldo(
    payload: GetVacationSaldoRequest,
  ): Promise<GetVacationSaldoResponse>;

  /**
   * Obtiene el historial de solicitudes de vacaciones
   * @param payload - Datos de la solicitud de historial de solicitudes de vacaciones
   * @returns VacationHistoryResponse
   */
  getVacationHistory(
    payload: VacationHistoryRequest,
  ): Promise<VacationHistoryResponse[]>;
}
