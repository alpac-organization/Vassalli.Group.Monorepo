import type { GetPayrollReportsAccumulatedResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export function filterAccumulatedHistoryByPayrollItems(
  reportData: GetPayrollReportsAccumulatedResponse[],
  payrollItems: PayrollItemResponse[],
): GetPayrollReportsAccumulatedResponse[] {
  const collaboratorCodes = new Set(
    payrollItems
      .map((item) => item.collaborator?.collaborator_code?.trim())
      .filter((code): code is string => !!code),
  );

  if (collaboratorCodes.size === 0) return [];

  return reportData.filter((item) => {
    const code = item.collaborator_code?.trim();
    return code ? collaboratorCodes.has(code) : false;
  });
}
