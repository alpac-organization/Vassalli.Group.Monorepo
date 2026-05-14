import * as XLSX from "xlsx";
import { getPayrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import type { ExportPayrollExcelParams } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/types/export-payroll.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

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
  const rows = data.map((item) => {
    return activeColumns.reduce<Record<string, string | number>>((acc, col) => {
      const cellValue = col.render ? col.render(item) : (item as any)[col.key];
      acc[col.label] = toExcelCellValue(cellValue);
      return acc;
    }, {});
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

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
