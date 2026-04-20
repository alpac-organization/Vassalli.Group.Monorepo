import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";
export interface IPayrollServices {
  getPayrollsProcessStatus(
    payload: PayrollProcessRequest,
  ): Promise<GetPayrollProcessResponse>;
}
