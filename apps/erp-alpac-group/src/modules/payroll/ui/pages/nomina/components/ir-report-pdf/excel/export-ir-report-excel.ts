import {
  C,
  LOGO_MAX_HEIGHT,
  LOGO_MAX_WIDTH,
  THIN_BORDER,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import {
  fitImageInBox,
  getImageNaturalSize,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { ExportIrReportExcelParams } from "../types/ir-report.types";

const COLUMNS = [
  { key: "code", label: "Código", width: 15 },
  { key: "name", label: "Nombre", width: 45 },
  { key: "salary", label: "Salario Devengado", width: 20 },
  { key: "ir", label: "Retención IR", width: 20 },
] as const;

const COL_COUNT = COLUMNS.length;
const HEADER_ROW = 3;
const LOGO_COLUMN_INDEX = COL_COUNT;

export async function exportIrReportExcel({
  data,
  branchName,
  startDate,
  endDate,
  logoUrl,
  isFortnightly,
}: ExportIrReportExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const totalIr = data.reduce(
    (acc, item) => acc + (isFortnightly ? (item.ir_fortnightly ?? 0) : (item.ir_monthly ?? 0)),
    0,
  );
  
  const totalSalary = data.reduce(
    (acc, item) => acc + (isFortnightly ? (item.salary_earned_fortnightly ?? 0) : (item.salary_earned_monthly ?? 0)),
    0,
  );

  const reportTitle = isFortnightly ? "Reporte IR Quincenal" : "Reporte IR Mensual";

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Reporte IR", {
    pageSetup: {
      orientation: "portrait",
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: HEADER_ROW }],
  });

  ws.columns = COLUMNS.map((col) => ({ width: col.width }));

  {
    const row = ws.addRow([`${reportTitle} - ${branchName ?? ""}`]);
    ws.mergeCells(1, 1, 1, COL_COUNT);
    row.height = LOGO_MAX_HEIGHT + 8;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const periodLabel =
      startDate && endDate
        ? `Fecha de: ${startDate} al ${formatDateToSpanishWords(endDate.trim())}`
        : `Período: ${formatDateToSpanishWords(startDate?.trim() ?? "—")} al ${formatDateToSpanishWords(endDate?.trim() ?? "—")}`;
    const row = ws.addRow([periodLabel]);
    ws.mergeCells(2, 1, 2, COL_COUNT);
    row.height = 18;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const row = ws.addRow(COLUMNS.map((col) => col.label));
    row.height = 24;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.headerBg },
      };
      cell.font = { bold: true, size: 10 };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = THIN_BORDER;
    }
  }

  data.forEach((item) => {
    const salary = isFortnightly ? (item.salary_earned_fortnightly ?? 0) : (item.salary_earned_monthly ?? 0);
    const ir = isFortnightly ? (item.ir_fortnightly ?? 0) : (item.ir_monthly ?? 0);

    const row = ws.addRow([
      item.collaborator_code || "—",
      item.collaborator_fullname || "—",
      salary,
      ir,
    ]);

    row.height = 18;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.font = { size: 9 };
      cell.alignment = { vertical: "middle" };
      cell.border = THIN_BORDER;

      if (c >= 3) {
        cell.numFmt = '#,##0.00" "';
      }
    }
  });

  if (data.length > 0) {
    const row = ws.addRow(["TOTAL GENERAL", "", totalSalary, totalIr]);
    row.height = 20;
    ws.mergeCells(row.number, 1, row.number, 2);

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.font = { bold: true, size: 9, color: { argb: C.areaTotalsText } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.areaTotalsBg },
      };
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: "middle" };

      if (c >= 3) {
        cell.numFmt = '#,##0.00" "';
      }
    }
    row.getCell(1).alignment = { horizontal: "right", vertical: "middle" };
  }

  if (logoUrl) {
    try {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const extMatch = logoUrl.match(/\.(\w+)(?:\?.*)?$/);
        const rawExt = extMatch?.[1]?.toLowerCase() ?? "png";
        const extension = (rawExt === "jpg" ? "jpeg" : rawExt) as
          | "png"
          | "jpeg"
          | "gif";
        const imageId = wb.addImage({ buffer: arrayBuffer, extension });
        const naturalSize = await getImageNaturalSize(arrayBuffer);
        const logoSize = fitImageInBox(
          naturalSize.width,
          naturalSize.height,
          LOGO_MAX_WIDTH,
          LOGO_MAX_HEIGHT,
        );

        ws.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: logoSize.width, height: logoSize.height },
          editAs: "oneCell",
        });
      }
    } catch {}
  }

  const branchLabel = branchName?.trim() || "sin-sucursal";
  const periodType = isFortnightly ? "quincenal" : "mensual";
  const periodStart = startDate?.trim() || "sin-inicio";
  const periodEnd = endDate?.trim() || "sin-fin";
  const fileName =
    `reporte-ir-${periodType}-${slugify(branchLabel)}-` +
    `${slugify(periodStart)}-a-${slugify(periodEnd)}.xlsx`;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
