import type { GetPayrollReportsAccumulatedResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
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

export type ExportAccumulatedHistoryExcelParams = {
  data: GetPayrollReportsAccumulatedResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string | null;
};

const COLUMNS = [
  { key: "code", label: "Código", width: 14 },
  { key: "name", label: "Nombre", width: 32 },
  { key: "accumulatedIr", label: "Acum IR", width: 14 },
  { key: "salaryEarned", label: "Acum Devengado", width: 16 },
] as const;

const COL_COUNT = COLUMNS.length;
const HEADER_ROW = 3;
const LOGO_COLUMN_INDEX = COL_COUNT;

export async function exportAccumulatedHistoryExcel({
  data,
  branchName,
  startDate,
  endDate,
  logoUrl,
}: ExportAccumulatedHistoryExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const totalAccumulatedIr = data.reduce(
    (acc, item) => acc + (item.accumulated_ir ?? 0),
    0,
  );
  const totalSalaryEarned = data.reduce(
    (acc, item) => acc + (item.salary_earned ?? 0),
    0,
  );

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Historial Acumulados", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: HEADER_ROW }],
  });

  ws.columns = COLUMNS.map((col) => ({ width: col.width }));
  ws.getColumn(LOGO_COLUMN_INDEX + 1).width = 18;

  {
    const row = ws.addRow([`Historial de Acumulados - ${branchName ?? ""}`]);
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
      cell.font = { bold: true, size: 8 };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = THIN_BORDER;
    }
  }

  for (const item of data) {
    const row = ws.addRow([
      item.collaborator_code || "—",
      item.collaborator_fullname || "—",
      item.accumulated_ir ?? 0,
      item.salary_earned ?? 0,
    ]);
    row.height = 14;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.font = { size: 8 };
      cell.border = THIN_BORDER;
      if (c <= 2) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "right" };
        cell.numFmt = "#,##0.00";
      }
    }
  }

  if (data.length > 0) {
    const row = ws.addRow(["", "TOTAL", totalAccumulatedIr, totalSalaryEarned]);
    row.height = 16;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.globalBg },
      };
      cell.font = { bold: true, size: 8, color: { argb: C.globalText } };
      cell.border = THIN_BORDER;
      if (c <= 2) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "right" };
        cell.numFmt = "#,##0.00";
      }
    }
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
          tl: { col: LOGO_COLUMN_INDEX, row: 0 },
          ext: { width: logoSize.width, height: logoSize.height },
          editAs: "oneCell",
        });
      }
    } catch {}
  }

  const branchLabel = branchName?.trim() || "sin-sucursal";
  const periodStart = startDate?.trim() || "sin-inicio";
  const periodEnd = endDate?.trim() || "sin-fin";
  const fileName =
    `historial-acumulados-${slugify(branchLabel)}-` +
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
