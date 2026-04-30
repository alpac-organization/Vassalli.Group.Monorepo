import type { GenerateReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
export interface IReportsServices {
  generateReports(payload: GenerateReportRequest): Promise<Blob>;
}
