export interface MonthlyRetentionReportRow {
  identification_number: string;
  full_name: string;
  gross_monthly_income: number;
  inss_monthly: number;
  taxable_base: number;
  withheld_ir: number;
  retention_code: string;
}

export type ExportMonthlyRetentionReportExcelParams = {
  data: MonthlyRetentionReportRow[];
  branchName: string;
};
