import type { IHttpHandler } from "@app/core/ports";
import type { IDeductionServices } from "@app/modules/payroll/application/interfaces/deduction-interfaces/IDeductionServices";
import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { RegisterChildSupportOfficialLetterRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/register-child-support-official-letter.request";
import type { UpdateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/update-deduction.request";

export class DeductionServices implements IDeductionServices {

   private readonly httpHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.httpHandler = httpHandler;
   }

   async CreateDeduction(payload: CreateDeductionRequest): Promise<void> {
      const { company_id, module_code, ...rest } = payload;

      const url = `/companies/${company_id}/modules/${module_code}/deductions`;

      await this.httpHandler.post(url, rest);
   }

   async RegisterChildSupportOfficialLetter(
      payload: RegisterChildSupportOfficialLetterRequest,
   ): Promise<void> {
      const { company_id, module_code, deduction_id, ...rest } = payload;

      const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}/official-letter`;

      await this.httpHandler.patch(url, rest);
   }

   async UpdateDeduction(payload: UpdateDeductionRequest): Promise<void> {
      const { company_id, module_code, deduction_id, ...rest } = payload;

      const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}`;

      await this.httpHandler.put(url, rest);
   }
}