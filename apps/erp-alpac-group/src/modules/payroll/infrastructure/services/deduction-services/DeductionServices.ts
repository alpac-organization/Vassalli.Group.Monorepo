import type { IHttpHandler } from "@app/core/ports";
import type { IDeductionServices } from "@app/modules/payroll/application/interfaces/deduction-interfaces/IDeductionServices";
import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";

export class DeductionServices implements IDeductionServices {

   private readonly httpHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.httpHandler = httpHandler;
   }

   async CreateDeduction(payload: CreateDeductionRequest): Promise<void> {
      try {
         const { company_id, module_code, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/deductions`;

         await this.httpHandler.post(url, rest);
      } catch (error) {
         throw error;
      }
   }
}