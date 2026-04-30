import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { InitializePayrollResponse } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
export interface IPayrollServices {
  getPayrollsProcessStatus(
    payload: PayrollProcessRequest,
  ): Promise<GetPayrollProcessResponse>;
  getPayroll(payload: PayrollRequest): Promise<GetPayrollResponse>;
  //   initializePayroll(
  //     payload: InitializePayrollParams,
  //   ): Promise<InitializePayrollResponse>;
}
