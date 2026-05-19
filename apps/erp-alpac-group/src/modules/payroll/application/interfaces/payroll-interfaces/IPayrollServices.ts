import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { PayrollPeriodsHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-periods-history.request";
import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";
import type { GenerateReportPayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/generate-report-payroll";
import type { GetPayrollReportsPayloadResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PayrollCloseRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-close.request";
import type { ClosePayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/payroll-close.response";
export interface IPayrollServices {
  getPayrollsProcessStatus(
    payload: PayrollProcessRequest,
  ): Promise<GetPayrollProcessResponse>;
  getPayroll(payload: PayrollRequest): Promise<GetPayrollResponse>;
  initializePayroll(payload: InitializePayrollParams): Promise<void | null>;
  getPayrollPeriodsHistory(
    payload: Omit<PayrollPeriodsHistoryRequest, "page_number" | "page_size">,
  ): Promise<PayrollPeriodItem[]>;
  generateReportsPayroll(
    payload: GenerateReportPayrollRequest,
  ): Promise<GetPayrollReportsPayloadResponse>;
  closePayroll(payload: PayrollCloseRequest): Promise<ClosePayrollResponse>;
}
