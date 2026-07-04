import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { DEDUCTION_CONCEPTS } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/constants/deduction-concepts";
import { exportConceptSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-concept-summary-excel";

export type ExportDeductionSummaryExcelParams = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  periodCode?: string;
  logoUrl?: string | null;
};

export async function exportDeductionSummaryExcel(
  params: ExportDeductionSummaryExcelParams,
): Promise<void> {
  await exportConceptSummaryExcel({
    title: "Resumen de Deducciones",
    fileNamePrefix: "reporte-deducciones",
    concepts: DEDUCTION_CONCEPTS,
    ...params,
  });
}
