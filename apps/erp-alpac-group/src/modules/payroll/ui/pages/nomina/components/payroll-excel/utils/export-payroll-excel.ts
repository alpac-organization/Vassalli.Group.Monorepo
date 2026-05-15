import * as XLSX from "xlsx";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import {
  getPayrollColumns,
  type PayrollColumnDef,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import type { ExportPayrollExcelParams } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/types/export-payroll.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  calcAreaTotals,
  groupByWorkArea,
} from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}

function toExcelCellValue(value: unknown): string | number {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return "—";
}

function payrollItemToRow(
  item: PayrollItemResponse,
  activeColumns: PayrollColumnDef[],
): (string | number)[] {
  return activeColumns.map((col) => toExcelCellValue(col.render(item)));
}

function totalsRow(
  activeColumns: PayrollColumnDef[],
  totals: Record<string, string>,
  firstColumnLabel: string,
): (string | number)[] {
  return activeColumns.map((col, colIndex) => {
    if (colIndex === 0) return firstColumnLabel;
    return totals[col.key] ?? "";
  });
}

export function exportPayrollExcel({
  data,
  visibleKeys,
  companyName,
  branchName,
  startDate,
  endDate,
  typePayroll,
}: ExportPayrollExcelParams): void {
  const activeColumns = getPayrollColumns(companyName).filter((col) =>
    visibleKeys.includes(col.key as string),
  );
  const colCount = activeColumns.length;
  const headerRow = activeColumns.map((col) => col.label);

  const grouped = groupByWorkArea(data);
  const aoa: (string | number)[][] = [headerRow];
  const merges: XLSX.Range[] = [];
  let rowIndex = 1;

  for (const [areaName, areaItems] of grouped) {
    aoa.push([areaName, ...Array(Math.max(0, colCount - 1)).fill("")]);
    merges.push({
      s: { r: rowIndex, c: 0 },
      e: { r: rowIndex, c: Math.max(0, colCount - 1) },
    });
    rowIndex += 1;

    for (const item of areaItems) {
      aoa.push(payrollItemToRow(item, activeColumns));
      rowIndex += 1;
    }

    const areaTotals = calcAreaTotals(areaItems, activeColumns);
    const areaTotalLabel = `Total ${areaName} (${areaItems.length} colab.)`;
    aoa.push(totalsRow(activeColumns, areaTotals, areaTotalLabel));
    rowIndex += 1;
  }

  const globalTotals = calcAreaTotals(data, activeColumns);
  const globalLabel = `TOTAL GENERAL (${data.length} colaboradores)`;
  aoa.push(totalsRow(activeColumns, globalTotals, globalLabel));

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  if (merges.length > 0) {
    worksheet["!merges"] = merges;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nomina");

  const payrollLabel = PAYROLL_TYPE_LABELS[typePayroll ?? "None"];
  const branchLabel = branchName?.trim() || "sin-sucursal";
  const periodStart = startDate?.trim() || "sin-inicio";
  const periodEnd = endDate?.trim() || "sin-fin";
  const fileName =
    `reporte-nomina-${slugify(payrollLabel)}-${slugify(branchLabel)}-` +
    `${formatDateToSpanishWords(slugify(periodStart))}-a-${formatDateToSpanishWords(slugify(periodEnd))}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
