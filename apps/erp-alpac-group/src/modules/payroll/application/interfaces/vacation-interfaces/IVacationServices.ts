import type { AddVacationBalanceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/add-vacation-balance.request";
import type { GetVacationSaldoRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/get-vacation-balance.request";
import type { GetVacationSaldoResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/vacation-saldo-response";

export interface IVacationServices {
   /**
    * Obtiene el saldo de vacaciones
    * @param payload - Datos de la solicitud de saldo de vacaciones
    * @returns GetVacationSaldoResponse
    */
   getVacationSaldo(payload: GetVacationSaldoRequest): Promise<GetVacationSaldoResponse>;

   /**
    * Actualiza el saldo de vacaciones: funcionalidad temporal
    * @param payload - Datos de la solicitud de actualización de saldo de vacaciones
    * @returns void
    */
   UpdateVacationBalance(payload: AddVacationBalanceRequest): Promise<void>;
}
