import type { IHttpHandler } from "@app/core/ports";
import type { IVacationServices } from "@app/modules/payroll/application/interfaces/vacation-interfaces/IVacationServices";
import type { AddVacationBalanceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/add-vacation-balance.request";
import type { GetVacationSaldoRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/get-vacation-balance.request";
import type { GetVacationSaldoResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/vacation-saldo-response";

export class VacationServices implements IVacationServices {

   private apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   public async getVacationSaldo(payload: GetVacationSaldoRequest): Promise<GetVacationSaldoResponse> {
      try {
         const { company_id, module_code, identification_number } = payload;

         const response = await this.apiHandler.get<GetVacationSaldoResponse>(
            `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/vacations`,
         );

         return response;
      } catch (error) {
         throw error;
      }
   }

   public async UpdateVacationBalance(payload: AddVacationBalanceRequest): Promise<void> {
      try {
         const { company_id, module_code, identification_number, vacation_id, vacation_balance, enjoyed_vacation } = payload;

         await this.apiHandler.put(
            `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/vacations`,
            { vacation_id, vacation_balance, enjoyed_vacation },
         );
      } catch (error) {
         throw error;
      }
   }
}
