import type {
  GetIrAndSalaryEarnedResponse,
  GetPayrollReportsInssInformationResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { MonthlyRetentionReportRow } from "../types/monthly-retention-report.types";

const RETENTION_CODE = "11";

export function buildMonthlyRetentionReportRows(
  inssMonthly: GetPayrollReportsInssInformationResponse[],
  irData: GetIrAndSalaryEarnedResponse[],
  payrollItems: PayrollItemResponse[],
): MonthlyRetentionReportRow[] {
  const inssByCode = new Map(
    inssMonthly.map((item) => [item.collaborator_code, item]),
  );
  const irByCode = new Map(
    irData.map((item) => [item.collaborator_code, item]),
  );

  return payrollItems.map((item) => {
    const collaboratorCode = item.collaborator?.collaborator_code ?? "";
    const inss = inssByCode.get(collaboratorCode);
    const ir = irByCode.get(collaboratorCode);
    const grossMonthlyIncome = (item.biweekly_salary ?? 0) * 2;
    const inssMonthlyValue = inss?.inss_lab ?? 0;
    const taxableBase = grossMonthlyIncome - inssMonthlyValue;

    return {
      identification_number: item.collaborator?.identification_number ?? "",
      full_name: item.collaborator?.full_name ?? "",
      gross_monthly_income: grossMonthlyIncome,
      inss_monthly: inssMonthlyValue,
      taxable_base: taxableBase,
      withheld_ir: ir?.ir_monthly ?? 0,
      retention_code: RETENTION_CODE,
    };
  });
}
