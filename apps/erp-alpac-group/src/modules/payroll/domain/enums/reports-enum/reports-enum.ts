import type { ReportType } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
export const ReportTypeEnum: Record<ReportType, string> = {
   TravelExpenses: "Gastos de Viaje",
};
