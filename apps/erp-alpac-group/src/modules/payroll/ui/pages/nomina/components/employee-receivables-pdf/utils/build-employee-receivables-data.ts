import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { IDeductionsServicesByPayroll } from "@app/modules/payroll/application/interfaces/deduction-interfaces/IDeductionsServicesByPayroll";
import type { EmployeeReceivableItem } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/employee-receivables-pdf-document";

export type BuildEmployeeReceivablesDataParams = {
  allItems: PayrollItemResponse[];
  companyId: string;
  moduleCode: string;
  deductionsService: IDeductionsServicesByPayroll;
};

export async function buildEmployeeReceivablesReportData({
  allItems,
  companyId,
  moduleCode,
  deductionsService,
}: BuildEmployeeReceivablesDataParams): Promise<EmployeeReceivableItem[]> {
  const deductionsResponse = await deductionsService.GetDeductionsByAsync({
    companie_id: companyId,
    module_code: moduleCode,
    type: 1,
    page_number: 1,
    page_size: 10,
  });

  const relevantDeductions = deductionsResponse.data.filter((d) =>
    allItems.some(
      (item) =>
        item.collaborator?.identification_number === d.identification_number,
    ),
  );

  const reportData: EmployeeReceivableItem[] = [];

  for (const deduction of relevantDeductions) {
    const details = await deductionsService.GetDeductionDetailsAsync({
      companie_id: companyId,
      module_code: moduleCode,
      deduction_id: deduction.deduction_id,
      identification_number: deduction.identification_number,
    });

    const collaboratorItem = allItems.find(
      (item) =>
        item.collaborator?.identification_number ===
        deduction.identification_number,
    );
    const collaborator = collaboratorItem?.collaborator;

    if (!collaborator || !details) continue;

    const isDolares = details.currency === "USD";
    const currencyStr = isDolares ? "US$" : "C$";

    reportData.push({
      codigo: collaborator.collaborator_code,
      nombre: collaborator.full_name,
      cargo: collaborator.job_position || "",
      monto: isDolares
        ? details.total_amount_in_dollars || 0
        : details.total_amount || 0,
      monedaOriginal: currencyStr,
      noCuotasQuincenal: details.number_fortnights || 0,
      cuotasPagadas: details.number_fortnights_paid || 0,
      cuotasPendientes:
        (details.number_fortnights || 0) - (details.number_fortnights_paid || 0),
      dolares: {
        cuotasPagadas: isDolares ? details.amount_paid_in_dollars || 0 : 0,
        montoCuotas: isDolares ? details.fortnightly_amount_in_dollars || 0 : 0,
        cuotasPendientes: isDolares ? details.total_balance_in_dollars || 0 : 0,
      },
      cordobas: {
        cuotasPagadas: details.amount_paid || 0,
        montoCuotas: details.fortnightly_amount || 0,
        cuotasPendientes: details.total_balance || 0,
      },
    });
  }

  return reportData;
}
