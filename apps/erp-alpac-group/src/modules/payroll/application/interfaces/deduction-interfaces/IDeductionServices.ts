import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";

export interface IDeductionServices {
   CreateDeduction(payload: CreateDeductionRequest): Promise<void>;
}