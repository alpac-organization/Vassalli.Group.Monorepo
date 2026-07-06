import type { EmployeeReceivableItem } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/employee-receivables-pdf-document";
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
import type { Worksheet } from "exceljs";

export type ExportEmployeeReceivablesExcelParams = {
  data: EmployeeReceivableItem[];
  companyName: string;
  branchName?: string | null;
  logoUrl?: string | null;
};

const BASE_COLUMN_COUNT = 8;
const DOLARES_COLUMN_COUNT = 3;
const CORDOBAS_COLUMN_COUNT = 3;
const COL_COUNT =
  BASE_COLUMN_COUNT + DOLARES_COLUMN_COUNT + CORDOBAS_COLUMN_COUNT;

const HEADER_ROW_1 = 3;
const HEADER_ROW_2 = 4;

const COLUMN_WIDTHS = [
  10, 28, 20, 12, 12, 12, 10, 10, 12, 12, 12, 12, 12, 12,
] as const;

const BASE_HEADERS = [
  "Codigo",
  "Nombre del Empleado",
  "Cargo",
  "Monto",
  "Moneda Original",
  "No Cuotas Quincenal",
  "Cuotas Pagadas",
  "Cuotas Pendientes",
] as const;

const DOLARES_HEADERS = [
  "Cuotas Pagadas",
  "Monto Cuotas",
  "Cuotas Pendientes",
] as const;

const CORDOBAS_HEADERS = [
  "Cuotas Pagadas",
  "Monto Cuotas",
  "Cuotas Pendientes",
] as const;

const AMOUNT_NUM_FMT = "#,##0.00";
const INTEGER_NUM_FMT = "#,##0";

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

function applyDataCellStyle(
  cell: {
    font?: unknown;
    alignment?: unknown;
    border?: unknown;
    numFmt?: string;
  },
  options: { align: "left" | "center" | "right"; numFmt?: string },
) {
  cell.font = { size: 8 };
  cell.alignment = { vertical: "middle", horizontal: options.align };
  cell.border = THIN_BORDER;
  if (options.numFmt) {
    cell.numFmt = options.numFmt;
  }
}

function applyTotalRowStyle(
  cell: {
    fill?: unknown;
    font?: unknown;
    alignment?: unknown;
    border?: unknown;
    numFmt?: string;
  },
  options: { align: "left" | "right"; numFmt?: string },
) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: C.globalBg },
  };
  cell.font = { bold: true, size: 8, color: { argb: C.globalText } };
  cell.alignment = { vertical: "middle", horizontal: options.align };
  cell.border = THIN_BORDER;
  if (options.numFmt) {
    cell.numFmt = options.numFmt;
  }
}

function writeTwoRowHeaders(ws: Worksheet) {
  const row1 = ws.getRow(HEADER_ROW_1);
  const row2 = ws.getRow(HEADER_ROW_2);
  row1.height = 24;
  row2.height = 24;

  for (let c = 1; c <= BASE_COLUMN_COUNT; c += 1) {
    const cell1 = row1.getCell(c);
    const cell2 = row2.getCell(c);
    cell1.value = BASE_HEADERS[c - 1];
    ws.mergeCells(HEADER_ROW_1, c, HEADER_ROW_2, c);
    applyHeaderCellStyle(cell1);
    applyHeaderCellStyle(cell2);
  }

  const dolaresStart = BASE_COLUMN_COUNT + 1;
  const dolaresEnd = BASE_COLUMN_COUNT + DOLARES_COLUMN_COUNT;
  row1.getCell(dolaresStart).value = "DOLARES";
  ws.mergeCells(HEADER_ROW_1, dolaresStart, HEADER_ROW_1, dolaresEnd);
  applyHeaderCellStyle(row1.getCell(dolaresStart));

  for (let offset = 0; offset < DOLARES_COLUMN_COUNT; offset += 1) {
    const cell = row2.getCell(dolaresStart + offset);
    cell.value = DOLARES_HEADERS[offset];
    applyHeaderCellStyle(cell);
  }

  const cordobasStart = dolaresEnd + 1;
  const cordobasEnd = COL_COUNT;
  row1.getCell(cordobasStart).value = "CORDOBAS";
  ws.mergeCells(HEADER_ROW_1, cordobasStart, HEADER_ROW_1, cordobasEnd);
  applyHeaderCellStyle(row1.getCell(cordobasStart));

  for (let offset = 0; offset < CORDOBAS_COLUMN_COUNT; offset += 1) {
    const cell = row2.getCell(cordobasStart + offset);
    cell.value = CORDOBAS_HEADERS[offset];
    applyHeaderCellStyle(cell);
  }
}

function buildRowValues(item: EmployeeReceivableItem): (string | number)[] {
  return [
    item.codigo,
    item.nombre,
    item.cargo,
    item.monto,
    item.monedaOriginal,
    item.noCuotasQuincenal,
    item.cuotasPagadas,
    item.cuotasPendientes,
    item.dolares.cuotasPagadas,
    item.dolares.montoCuotas,
    item.dolares.cuotasPendientes,
    item.cordobas.cuotasPagadas,
    item.cordobas.montoCuotas,
    item.cordobas.cuotasPendientes,
  ];
}

function writeDataRow(ws: Worksheet, item: EmployeeReceivableItem) {
  const row = ws.addRow(buildRowValues(item));
  row.height = 14;

  for (let c = 1; c <= COL_COUNT; c += 1) {
    const cell = row.getCell(c);
    if (c === 1) {
      applyDataCellStyle(cell, { align: "center" });
      continue;
    }
    if (c === 2 || c === 3) {
      applyDataCellStyle(cell, { align: "left" });
      continue;
    }
    if (c === 5) {
      applyDataCellStyle(cell, { align: "center" });
      continue;
    }
    if (c === 4 || c >= 9) {
      applyDataCellStyle(cell, { align: "right", numFmt: AMOUNT_NUM_FMT });
      continue;
    }
    applyDataCellStyle(cell, { align: "center", numFmt: INTEGER_NUM_FMT });
  }
}

function computeTotals(data: EmployeeReceivableItem[]) {
  return {
    dolaresCuotasPagadas: data.reduce(
      (sum, item) => sum + (item.dolares.cuotasPagadas || 0),
      0,
    ),
    dolaresMontoCuotas: data.reduce(
      (sum, item) => sum + (item.dolares.montoCuotas || 0),
      0,
    ),
    dolaresCuotasPendientes: data.reduce(
      (sum, item) => sum + (item.dolares.cuotasPendientes || 0),
      0,
    ),
    cordobasCuotasPagadas: data.reduce(
      (sum, item) => sum + (item.cordobas.cuotasPagadas || 0),
      0,
    ),
    cordobasMontoCuotas: data.reduce(
      (sum, item) => sum + (item.cordobas.montoCuotas || 0),
      0,
    ),
    cordobasCuotasPendientes: data.reduce(
      (sum, item) => sum + (item.cordobas.cuotasPendientes || 0),
      0,
    ),
  };
}

export async function exportEmployeeReceivablesExcel({
  data,
  companyName,
  branchName,
  logoUrl,
}: ExportEmployeeReceivablesExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");
  const totals = computeTotals(data);

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Saldos por Cobrar", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: HEADER_ROW_2 }],
  });

  ws.columns = COLUMN_WIDTHS.map((width) => ({ width }));

  {
    const row = ws.addRow([
      `Saldos por Cobrar a Empleados - ${companyName ?? ""}`,
    ]);
    ws.mergeCells(1, 1, 1, COL_COUNT);
    row.height = LOGO_MAX_HEIGHT + 8;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  if (branchName?.trim()) {
    const row = ws.addRow([branchName.trim()]);
    ws.mergeCells(2, 1, 2, COL_COUNT);
    row.height = 18;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  writeTwoRowHeaders(ws);

  for (const item of data) {
    writeDataRow(ws, item);
  }

  if (data.length > 0) {
    const totalRowValues: (string | number)[] = [
      "Totales",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      totals.dolaresCuotasPagadas,
      totals.dolaresMontoCuotas,
      totals.dolaresCuotasPendientes,
      totals.cordobasCuotasPagadas,
      totals.cordobasMontoCuotas,
      totals.cordobasCuotasPendientes,
    ];
    const row = ws.addRow(totalRowValues);
    row.height = 16;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      if (c === 1) {
        applyTotalRowStyle(cell, { align: "left" });
        continue;
      }
      if (c >= 9) {
        applyTotalRowStyle(cell, { align: "right", numFmt: AMOUNT_NUM_FMT });
        continue;
      }
      applyTotalRowStyle(cell, { align: "left" });
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
          tl: { col: Math.max(0, COL_COUNT - 4), row: 0 },
          ext: { width: logoSize.width, height: logoSize.height },
          editAs: "oneCell",
        });
      }
    } catch {}
  }

  const companyLabel = companyName?.trim() || "sin-empresa";
  const branchLabel = branchName?.trim() || "sin-sucursal";
  const fileName =
    `saldos-por-cobrar-empleados-${slugify(companyLabel)}-` +
    `${slugify(branchLabel)}.xlsx`;

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
