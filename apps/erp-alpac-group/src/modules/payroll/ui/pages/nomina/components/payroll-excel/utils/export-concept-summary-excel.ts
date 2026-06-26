import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
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
import { groupByWorkArea } from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";
import { formatDate, formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export type ConceptSummaryItem = {
  key: string;
  label: string;
  getValue: (item: PayrollItemResponse) => number;
};

export type ExportConceptSummaryExcelParams = {
  title: string;
  fileNamePrefix: string;
  concepts: ConceptSummaryItem[];
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  periodCode?: string;
  logoUrl?: string | null;
};

const COLUMNS = [
  { key: "code", label: "Cod Emp", width: 14 },
  { key: "name", label: "Nombre", width: 32 },
  { key: "total", label: "Total", width: 14 },
  { key: "period", label: "Periodo", width: 14 },
  { key: "area", label: "Area", width: 20 },
] as const;

const COL_COUNT = COLUMNS.length;
const HEADER_ROW = 3;
const LOGO_COLUMN_INDEX = COL_COUNT;

function applyHeaderStyle(cell: {
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

function applyDataStyle(cell: {
  font?: unknown;
  alignment?: unknown;
  border?: unknown;
  numFmt?: string;
}) {
  cell.font = { size: 8 };
  cell.alignment = { vertical: "middle" };
  cell.border = THIN_BORDER;
}

function writeColumnHeaders(ws: import("exceljs").Worksheet) {
  const row = ws.getRow(HEADER_ROW);
  row.height = 24;
  COLUMNS.forEach((col, index) => {
    const cell = row.getCell(index + 1);
    cell.value = col.label;
    applyHeaderStyle(cell);
    if (col.key === "total") {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    }
  });
}

function writeConceptHeader(ws: import("exceljs").Worksheet, label: string) {
  const row = ws.addRow([`Concepto: ${label}`]);
  const rn = row.number;
  ws.mergeCells(rn, 1, rn, COL_COUNT);
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

function writeAreaHeader(ws: import("exceljs").Worksheet, areaName: string) {
  const row = ws.addRow([areaName]);
  const rn = row.number;
  ws.mergeCells(rn, 1, rn, COL_COUNT);
  row.height = 14;
  const cell = row.getCell(1);
  cell.font = { bold: true, size: 8, italic: true };
  cell.alignment = { horizontal: "left", vertical: "middle" };
}

function writeDataRow(
  ws: import("exceljs").Worksheet,
  item: PayrollItemResponse,
  periodLabel: string,
  getValue: (item: PayrollItemResponse) => number,
) {
  const row = ws.addRow([
    item.collaborator?.collaborator_code ?? "—",
    item.collaborator?.full_name ?? "—",
    getValue(item),
    periodLabel,
    item.collaborator?.work_area ?? "—",
  ]);
  row.height = 14;
  for (let c = 1; c <= COL_COUNT; c += 1) {
    const cell = row.getCell(c);
    applyDataStyle(cell);
    if (c === 3) {
      cell.alignment = { vertical: "middle", horizontal: "right" };
      cell.numFmt = "#,##0.00";
    } else if (c === 4) {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    } else {
      cell.alignment = { vertical: "middle", horizontal: "left" };
    }
  }
}

function writeConceptTotalRow(
  ws: import("exceljs").Worksheet,
  conceptLabel: string,
  itemCount: number,
  total: number,
) {
  const row = ws.addRow([
    "",
    `Total ${conceptLabel} (${itemCount} colaboradores)`,
    total,
    "",
    "",
  ]);
  row.height = 14;
  for (let c = 1; c <= COL_COUNT; c += 1) {
    const cell = row.getCell(c);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: C.areaTotalsBg },
    };
    cell.font = { bold: true, size: 8, color: { argb: C.areaTotalsText } };
    cell.border = THIN_BORDER;
    cell.alignment =
      c === 3
        ? { vertical: "middle", horizontal: "right" }
        : { vertical: "middle", horizontal: "left" };
    if (c === 3) cell.numFmt = "#,##0.00";
  }
}

function writeGlobalTotalRow(ws: import("exceljs").Worksheet, grandTotal: number) {
  const row = ws.addRow(["", "TOTAL GENERAL", grandTotal, "", ""]);
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
    cell.alignment =
      c === 3
        ? { vertical: "middle", horizontal: "right" }
        : { vertical: "middle", horizontal: "left" };
    if (c === 3) cell.numFmt = "#,##0.00";
  }
}

export async function exportConceptSummaryExcel({
  title,
  fileNamePrefix,
  concepts,
  data,
  branchName,
  startDate,
  endDate,
  periodCode = "",
  logoUrl,
}: ExportConceptSummaryExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");
  const periodLabel = periodCode.trim()
    ? formatDate(periodCode.trim())
    : "—";

  const grandTotal = concepts.reduce(
    (sum, concept) =>
      sum + data.reduce((s, item) => s + concept.getValue(item), 0),
    0,
  );

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet(title, {
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
    const row = ws.addRow([`${title} - ${branchName ?? ""}`]);
    ws.mergeCells(1, 1, 1, COL_COUNT);
    row.height = LOGO_MAX_HEIGHT + 8;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const period =
      startDate && endDate
        ? `Período: ${formatDateToSpanishWords(startDate.trim())} al ${formatDateToSpanishWords(endDate.trim())}`
        : `Período: ${formatDateToSpanishWords(startDate?.trim() ?? "—")} al ${formatDateToSpanishWords(endDate?.trim() ?? "—")}`;
    const row = ws.addRow([period]);
    ws.mergeCells(2, 1, 2, COL_COUNT);
    row.height = 18;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  writeColumnHeaders(ws);

  for (const concept of concepts) {
    const conceptItems = data.filter((item) => concept.getValue(item) > 0);
    if (conceptItems.length === 0) continue;

    writeConceptHeader(ws, concept.label);

    const grouped = groupByWorkArea(conceptItems);
    for (const [areaName, areaItems] of grouped) {
      writeAreaHeader(ws, areaName);
      for (const item of areaItems) {
        writeDataRow(ws, item, periodLabel, concept.getValue);
      }
    }

    const conceptTotal = conceptItems.reduce(
      (sum, item) => sum + concept.getValue(item),
      0,
    );
    writeConceptTotalRow(ws, concept.label, conceptItems.length, conceptTotal);
  }

  writeGlobalTotalRow(ws, grandTotal);

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
    `${fileNamePrefix}-${slugify(branchLabel)}-` +
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
