import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";
import type { ReportType } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
interface ReportDetailsProps {
   name: string;
   description: string;
   icon: LucideIcon;
}
export const ReportDetails: Record<ReportType, ReportDetailsProps> = {
   TravelExpenses: {
      name: "Gastos de Viaje",
      description:
         "Reporte detallado de todos los gastos de viaje registrados por colaboradores en un periodo determinado.",
      icon: FileText,
   },
};
export const REPORT_TYPES: ReportType[] = Object.keys(
   ReportDetails,
) as ReportType[];
