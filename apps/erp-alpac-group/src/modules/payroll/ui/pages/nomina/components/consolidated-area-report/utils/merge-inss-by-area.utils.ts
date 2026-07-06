import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { GetPayrollReportsInssInformationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { ConsolidatedAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";

const DEFAULT_AREA = "Sin Área";

export type InssAreaTotals = {
  inssPatronal: number;
  inatec: number;
};

export function buildCollaboratorAreaMap(
  items: PayrollItemResponse[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of items) {
    const code = item.collaborator?.collaborator_code?.trim();
    if (!code) continue;
    const area = item.collaborator?.work_area?.trim() || DEFAULT_AREA;
    map.set(code, area);
  }
  return map;
}

export function aggregateInssByArea(
  inssInformation: GetPayrollReportsInssInformationResponse[],
  areaByCollaboratorCode: Map<string, string>,
): Map<string, InssAreaTotals> {
  const totalsByArea = new Map<string, InssAreaTotals>();

  for (const inss of inssInformation) {
    const code = inss.collaborator_code?.trim();
    if (!code) continue;

    const area = areaByCollaboratorCode.get(code) ?? DEFAULT_AREA;
    const current = totalsByArea.get(area) ?? { inssPatronal: 0, inatec: 0 };
    current.inssPatronal += inss.inss_patronal ?? 0;
    current.inatec += inss.inatec ?? 0;
    totalsByArea.set(area, current);
  }

  return totalsByArea;
}

export function applyInssTotalsToRows(
  rows: ConsolidatedAreaRow[],
  inssByArea: Map<string, InssAreaTotals>,
): void {
  for (const row of rows) {
    const totals = inssByArea.get(row.areaName);
    if (!totals) continue;
    row.inssPatronal = totals.inssPatronal;
    row.inatec = totals.inatec;
  }
}
