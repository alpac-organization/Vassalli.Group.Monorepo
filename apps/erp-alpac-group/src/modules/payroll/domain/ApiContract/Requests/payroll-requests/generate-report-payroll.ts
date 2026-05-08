export interface GenerateReportPayrollRequest {
  report_type: ReportPayrollType;
  companie_id: string;
  payroll_id: string;
}
export type ReportPayrollType = "Accumulated";
