import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { RegisterChildSupportOfficialLetterRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/register-child-support-official-letter.request";
import type { UpdateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/update-deduction.request";

export interface IDeductionServices {
   CreateDeduction(payload: CreateDeductionRequest): Promise<void>;
   RegisterChildSupportOfficialLetter(payload: RegisterChildSupportOfficialLetterRequest): Promise<void>;
   UpdateDeduction(payload: UpdateDeductionRequest): Promise<void>;
}