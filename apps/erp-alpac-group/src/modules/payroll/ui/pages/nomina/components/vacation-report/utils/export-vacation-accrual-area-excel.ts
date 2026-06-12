import type { ExportVacationAccrualAreaExcelParams } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-accrual-area.types";
import {
  VACATION_ACCRUAL_AREA_COLUMNS,
  calcVacationAccrualAreaTotalsRaw,
  groupVacationAccrualAreaByWorkArea,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  fitImageInBox,
  getImageNaturalSize,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import {
  C,
  THIN_BORDER,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";

const LOGO_RESERVED_COLS = 2;
const LOGO_AREA_MAX_WIDTH = 110;
const LOGO_AREA_MAX_HEIGHT = 52;

function vacationAccrualColWidth(key: string): number {
  if (key === "collaborator_code" || key === "entry_date") return 14;
  if (key === "vacation_balance" || key === "agui_days") return 11;
  return 13;
}

function getTitleMergeEndCol(colCount: number, hasLogo: boolean): number {
  return hasLogo ? colCount - LOGO_RESERVED_COLS : colCount;
}

export async function exportVacationAccrualAreaExcel({
  rows,
  branchName,
  startDate,
  endDate,
  logoUrl,
}: ExportVacationAccrualAreaExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const columns = VACATION_ACCRUAL_AREA_COLUMNS;
  const colCount = columns.length;

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Acumulado Vacaciones", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: 3 }],
  });

  ws.columns = columns.map((col) => ({ width: vacationAccrualColWidth(col.key) }));

  const hasLogo = Boolean(logoUrl?.trim());
  const titleMergeEndCol = getTitleMergeEndCol(colCount, hasLogo);

  if (hasLogo) {
    ws.getColumn(titleMergeEndCol + 1).width = 16;
    ws.getColumn(colCount).width = 16;
  }

  {
    const row = ws.addRow([
      `Acumulado de Vacaciones por Área - ${branchName ?? ""}`,
    ]);
    ws.mergeCells(1, 1, 1, titleMergeEndCol);
    if (hasLogo) {
      ws.mergeCells(1, titleMergeEndCol + 1, 2, colCount);
    }
    row.height = 36;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  }

  {
    const period =
      `Período: ${formatDateToSpanishWords(startDate?.trim() ?? "—")} ` +
      `al ${formatDateToSpanishWords(endDate?.trim() ?? "—")}`;
    const row = ws.addRow([period]);
    ws.mergeCells(2, 1, 2, titleMergeEndCol);
    row.height = 28;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  }

  {
    const row = ws.addRow(columns.map((col) => col.label));
    row.height = 32;
    for (let c = 1; c <= colCount; c++) {
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

  const grouped = groupVacationAccrualAreaByWorkArea(rows);

  for (const [areaName, areaRows] of grouped) {
    {
      const row = ws.addRow([areaName.toUpperCase()]);
      const rn = row.number;
      ws.mergeCells(rn, 1, rn, colCount);
      row.height = 16;
      const cell = row.getCell(1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.areaHeaderBg },
      };
      cell.font = { bold: true, size: 8, color: { argb: C.areaHeaderText } };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    }

    for (const item of areaRows) {
      const row = ws.addRow(
        columns.map((col) =>
          col.getValue ? col.getValue(item) : col.render(item),
        ),
      );
      row.height = 14;
      for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c);
        cell.font = { size: 8 };
        cell.alignment = { vertical: "middle" };
        cell.border = THIN_BORDER;
      }
    }

    {
      const totals = calcVacationAccrualAreaTotalsRaw(areaRows, columns);
      const label = `Total ${areaName} (${areaRows.length} colab.)`;
      const rowData = columns.map((col, i) =>
        i === 0 ? label : (totals[col.key] ?? ""),
      );
      const row = ws.addRow(rowData);
      row.height = 14;
      for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: C.areaTotalsBg },
        };
        cell.font = { bold: true, size: 8, color: { argb: C.areaTotalsText } };
        cell.alignment = { vertical: "middle" };
        cell.border = THIN_BORDER;
      }
    }
  }

  {
    const totals = calcVacationAccrualAreaTotalsRaw(rows, columns);
    const label = `TOTAL GENERAL (${rows.length} colaboradores)`;
    const rowData = columns.map((col, i) =>
      i === 0 ? label : (totals[col.key] ?? ""),
    );
    const row = ws.addRow(rowData);
    row.height = 16;
    for (let c = 1; c <= colCount; c++) {
      const cell = row.getCell(c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.globalBg },
      };
      cell.font = { bold: true, size: 8, color: { argb: C.globalText } };
      cell.alignment = { vertical: "middle" };
      cell.border = THIN_BORDER;
    }
  }

  if (hasLogo && logoUrl) {
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
          LOGO_AREA_MAX_WIDTH,
          LOGO_AREA_MAX_HEIGHT,
        );
        const logoColStart = titleMergeEndCol;
        const approxColWidthPx = 16 * 7;
        const logoAreaWidthPx = LOGO_RESERVED_COLS * approxColWidthPx;
        const horizontalOffset =
          (logoAreaWidthPx - logoSize.width) / 2 / approxColWidthPx;
        const verticalOffset = 0.18;
        ws.addImage(imageId, {
          tl: {
            col: logoColStart + Math.max(0.1, horizontalOffset),
            row: verticalOffset,
          },
          ext: { width: logoSize.width, height: logoSize.height },
          editAs: "absolute",
        });
      }
    } catch {}
  }

  const branchLabel = branchName?.trim() || "sin-sucursal";
  const periodStart = startDate?.trim() || "sin-inicio";
  const periodEnd = endDate?.trim() || "sin-fin";
  const fileName =
    `reporte-acumulado-vacaciones-${slugify(branchLabel)}-` +
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
