import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { INCOME_CONCEPTS } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/constants/income-concepts";
import { exportConceptSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-concept-summary-excel";

export type ExportIncomeSummaryExcelParams = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  periodCode?: string;
  logoUrl?: string | null;
};

export async function exportIncomeSummaryExcel(
  params: ExportIncomeSummaryExcelParams,
): Promise<void> {
  await exportConceptSummaryExcel({
    title: "Resumen de Ingresos",
    fileNamePrefix: "reporte-ingresos",
    concepts: INCOME_CONCEPTS,
    ...params,
  });
}
