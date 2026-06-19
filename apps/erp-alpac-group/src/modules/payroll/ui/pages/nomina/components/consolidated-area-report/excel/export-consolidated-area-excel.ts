import {
  CONSOLIDATED_AREA_COLUMNS,
  getConsolidatedColumnCount,
  type ConsolidatedColumnDef,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/constants/consolidated-area-columns";
import type {
  ConsolidatedAreaRow,
  ExportConsolidatedAreaExcelParams,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import { buildConsolidatedAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/utils/build-consolidated-area-rows";
import {
  C,
  LOGO_MAX_HEIGHT,
  LOGO_MAX_WIDTH,
  THIN_BORDER,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import { fitImageInBox } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import { getImageNaturalSize } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { Worksheet } from "exceljs";

const HEADER_ROW_1 = 3;
const HEADER_ROW_2 = 4;

function getConsolidatedRawValue(
  row: ConsolidatedAreaRow,
  column: ConsolidatedColumnDef,
): string | number {
  if (column.key === "areaName") return row.areaName;

  const value = row[column.key];
  if (column.kind === "text") {
    return typeof value === "string" ? value : String(value ?? "—");
  }

  return typeof value === "number" ? value : Number(value ?? 0);
}

function buildRowValues(row: ConsolidatedAreaRow): (string | number)[] {
  return CONSOLIDATED_AREA_COLUMNS.map((column) =>
    getConsolidatedRawValue(row, column),
  );
}

function applyConsolidatedCellFormat(
  cell: { numFmt?: string },
  column: ConsolidatedColumnDef,
) {
  if (column.kind === "currency" || column.kind === "quantity") {
    cell.numFmt = "#,##0.00";
  }
}

function applyHeaderCellStyle(cell: {
  fill?: unknown;
  font?: unknown;
  alignment?: unknown;
  border?: unknown;
}) {
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

function applyDataCellStyle(cell: {
  font?: unknown;
  alignment?: unknown;
  border?: unknown;
}) {
  cell.font = { size: 8 };
  cell.alignment = { vertical: "middle", horizontal: "right" };
  cell.border = THIN_BORDER;
}

function applyTotalRowStyle(cell: {
  fill?: unknown;
  font?: unknown;
  alignment?: unknown;
  border?: unknown;
}) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: C.globalBg },
  };
  cell.font = { bold: true, size: 8, color: { argb: C.globalText } };
  cell.alignment = { vertical: "middle", horizontal: "right" };
  cell.border = THIN_BORDER;
}

function writeTwoRowHeaders(ws: Worksheet) {
  const colCount = getConsolidatedColumnCount();
  const row1 = ws.getRow(HEADER_ROW_1);
  const row2 = ws.getRow(HEADER_ROW_2);
  row1.height = 24;
  row2.height = 20;

  const deduccionesStart = CONSOLIDATED_AREA_COLUMNS.findIndex(
    (col) => col.group === "Deducciones",
  );
  const deduccionesEnd = CONSOLIDATED_AREA_COLUMNS.reduce(
    (last, col, index) => (col.group === "Deducciones" ? index : last),
    -1,
  );

  let colIndex = 1;
  while (colIndex <= colCount) {
    const column = CONSOLIDATED_AREA_COLUMNS[colIndex - 1];
    const cell1 = row1.getCell(colIndex);
    const cell2 = row2.getCell(colIndex);

    if (column.group === "Deducciones") {
      if (colIndex === deduccionesStart + 1) {
        const span = deduccionesEnd - deduccionesStart + 1;
        cell1.value = "Deducciones";
        ws.mergeCells(
          HEADER_ROW_1,
          colIndex,
          HEADER_ROW_1,
          colIndex + span - 1,
        );
        applyHeaderCellStyle(cell1);
      }

      cell2.value = column.subLabel ?? column.label;
      applyHeaderCellStyle(cell2);
      colIndex += 1;
      continue;
    }

    if (column.subLabel) {
      const groupLabel = column.label;
      let span = 1;
      while (
        colIndex + span <= colCount &&
        CONSOLIDATED_AREA_COLUMNS[colIndex - 1 + span]?.label === groupLabel &&
        CONSOLIDATED_AREA_COLUMNS[colIndex - 1 + span]?.subLabel
      ) {
        span += 1;
      }

      cell1.value = groupLabel;
      if (span > 1) {
        ws.mergeCells(
          HEADER_ROW_1,
          colIndex,
          HEADER_ROW_1,
          colIndex + span - 1,
        );
      } else {
        ws.mergeCells(HEADER_ROW_1, colIndex, HEADER_ROW_2, colIndex);
      }
      applyHeaderCellStyle(cell1);

      for (let offset = 0; offset < span; offset += 1) {
        const subCell = row2.getCell(colIndex + offset);
        subCell.value =
          CONSOLIDATED_AREA_COLUMNS[colIndex - 1 + offset]?.subLabel ?? "";
        applyHeaderCellStyle(subCell);
      }

      colIndex += span;
      continue;
    }

    cell1.value = column.label;
    ws.mergeCells(HEADER_ROW_1, colIndex, HEADER_ROW_2, colIndex);
    applyHeaderCellStyle(cell1);
    applyHeaderCellStyle(cell2);
    colIndex += 1;
  }
}

export async function exportConsolidatedAreaExcel({
  data,
  branchName,
  companyName: _companyName,
  startDate,
  endDate,
  logoUrl,
}: ExportConsolidatedAreaExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");
  const { rows, grandTotal } = buildConsolidatedAreaRows(data);
  const colCount = getConsolidatedColumnCount();

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Consolidada por Area", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: HEADER_ROW_2 }],
  });

  ws.columns = CONSOLIDATED_AREA_COLUMNS.map((col) => ({
    width: col.width ?? 12,
  }));

  {
    const row = ws.addRow([
      `Nomina Consolidada por Area - ${branchName ?? ""}`,
    ]);
    ws.mergeCells(1, 1, 1, colCount);
    row.height = 24;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const period =
      `Desde ${formatDateToSpanishWords(startDate?.trim() ?? "—")} ` +
      `Hasta ${formatDateToSpanishWords(endDate?.trim() ?? "—")}`;
    const row = ws.addRow([period]);
    ws.mergeCells(2, 1, 2, colCount);
    row.height = 18;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  writeTwoRowHeaders(ws);

  for (const areaRow of rows) {
    const row = ws.addRow(buildRowValues(areaRow));
    row.height = 14;
    for (let c = 1; c <= colCount; c += 1) {
      const cell = row.getCell(c);
      const column = CONSOLIDATED_AREA_COLUMNS[c - 1];
      applyDataCellStyle(cell);
      applyConsolidatedCellFormat(cell, column);
      if (c === 1) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.font = { size: 8, bold: true };
      }
    }
  }

  {
    const row = ws.addRow(buildRowValues(grandTotal));
    row.height = 16;
    for (let c = 1; c <= colCount; c += 1) {
      const cell = row.getCell(c);
      const column = CONSOLIDATED_AREA_COLUMNS[c - 1];
      applyTotalRowStyle(cell);
      applyConsolidatedCellFormat(cell, column);
      if (c === 1) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
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
          tl: { col: Math.max(0, colCount - 4), row: 0 },
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
    `nomina-consolidada-por-area-${slugify(branchLabel)}-` +
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
