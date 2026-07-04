import type { ExportVacationPermissionsSummaryExcelParams } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/types/vacation-permissions-summary.types";
import { formatVacationDaysValue } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/utils/build-vacation-permissions-summary.utils";
import {
  C,
  THIN_BORDER,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";

const TABLE_HEADERS = [
  "Item",
  "Cod Colaborador",
  "Nombre",
  "Fecha Inicio",
  "Fecha Fin",
  "Dia",
  "Tipo",
] as const;

const COLUMN_WIDTHS = [8, 14, 32, 14, 14, 10, 12];

function applyBorderToRow(
  row: import("exceljs").Row,
  colCount: number,
  bold = false,
  fillArgb?: string,
): void {
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: "middle" };
    cell.font = { size: 9, bold };
    if (fillArgb) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillArgb },
      };
    }
  }
}

export async function exportVacationPermissionsSummaryExcel({
  header,
  rows,
  branchName,
  startDate,
  endDate,
}: ExportVacationPermissionsSummaryExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const colCount = TABLE_HEADERS.length;
  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Cargue y Descargue de Vacacione", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  ws.columns = COLUMN_WIDTHS.map((width) => ({ width }));

  {
    const row = ws.addRow([
      `Cargue y Descargue de Vacaciones - ${branchName?.trim() || ""}`,
    ]);
    ws.mergeCells(row.number, 1, row.number, colCount);
    row.height = 28;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  ws.addRow([]);

  const metaRows: [string, string | number][] = [
    ["Fecha", header.date],
    ["Concepto", header.concept],
    ["Observacion", header.observation],
  ];

  for (const [label, value] of metaRows) {
    const row = ws.addRow([label, value]);
    row.height = 18;
    row.getCell(1).font = { bold: true, size: 10 };
    row.getCell(2).font = { size: 10 };
    ws.mergeCells(row.number, 2, row.number, colCount);
  }

  ws.addRow([]);

  {
    const row = ws.addRow([...TABLE_HEADERS]);
    row.height = 22;
    applyBorderToRow(row, colCount, true, C.headerBg);
    for (let c = 1; c <= colCount; c++) {
      row.getCell(c).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    }
  }

  for (const item of rows) {
    const row = ws.addRow([
      item.item,
      item.collaboratorCode,
      item.employeeName,
      item.startDate,
      item.endDate,
      formatVacationDaysValue(item.days),
      item.type,
    ]);
    row.height = 18;
    applyBorderToRow(row, colCount);
    row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(7).alignment = { horizontal: "center", vertical: "middle" };
  }

  const branchLabel = branchName?.trim() || "sin-sucursal";
  const periodStart = startDate?.trim() || "sin-inicio";
  const periodEnd = endDate?.trim() || "sin-fin";
  const fileName =
    `descargue-vacaciones-${slugify(branchLabel)}-` +
    `${slugify(periodStart)}-a-${slugify(periodEnd)}.xlsx`;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
