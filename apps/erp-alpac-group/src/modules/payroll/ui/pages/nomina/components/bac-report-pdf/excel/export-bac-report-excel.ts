import type { BacReportRow } from "../types/bac-report.types";
import { THIN_BORDER } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";

export type ExportBacReportExcelParams = {
  data: BacReportRow[];
  branchName: string;
};

const BAC_HEADER_BG = "FFFF0000";
const BAC_HEADER_TEXT = "FFFFFFFF";

const COLUMNS = [
  { key: "reference", label: "Referencia", width: 22 },
  { key: "name", label: "Nombre del Empleado", width: 40 },
  { key: "salary", label: "Salario", width: 14 },
] as const;

const COL_COUNT = COLUMNS.length;

export async function exportBacReportExcel({
  data,
  branchName,
}: ExportBacReportExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Reporte BAC", {
    pageSetup: {
      orientation: "portrait",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = COLUMNS.map((col) => ({ width: col.width }));

  {
    const row = ws.addRow(COLUMNS.map((col) => col.label));
    row.height = 24;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BAC_HEADER_BG },
      };
      cell.font = { bold: true, size: 10, color: { argb: BAC_HEADER_TEXT } };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = THIN_BORDER;
    }
  }

  data.forEach((item) => {
    const row = ws.addRow([
      item.identification_number || "—",
      item.full_name || "—",
      item.biweekly_salary ?? 0,
    ]);

    row.height = 20;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { size: 9 };
      cell.alignment = {
        vertical: "middle",
        horizontal: c === 3 ? "right" : "left",
      };

      if (c === 3) {
        cell.numFmt = '#,##0.00;[Red]-#,##0.00; "-"';
      }
    }
  });

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const now = new Date().toISOString().split("T")[0];
  const branchSlug = slugify(branchName);
  link.download = `reporte-bac-${branchSlug}-${now}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
