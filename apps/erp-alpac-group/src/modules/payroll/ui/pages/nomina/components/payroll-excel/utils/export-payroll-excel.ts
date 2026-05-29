import { getPayrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import type { ExportPayrollExcelParams } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/types/export-payroll.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  calcAreaTotalsRaw,
  groupByWorkArea,
} from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";
import {
  fitImageInBox,
  getImageNaturalSize,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import {
  C,
  THIN_BORDER,
  LOGO_MAX_WIDTH,
  LOGO_MAX_HEIGHT,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import {
  colWidth,
  slugify,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";

export async function exportPayrollExcel({
  data,
  visibleKeys,
  companyName,
  branchName,
  startDate,
  endDate,
  typePayroll,
  logoUrl,
}: ExportPayrollExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const activeColumns = getPayrollColumns(companyName).filter((col) =>
    visibleKeys.includes(col.key as string),
  );
  const colCount = activeColumns.length;
  const payrollLabel = PAYROLL_TYPE_LABELS[typePayroll ?? "None"];

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Nomina", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 5,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: 3 }],
  });

  ws.columns = activeColumns.map((col) => ({ width: colWidth(col.key) }));

  {
    const row = ws.addRow([
      `Reporte de Nómina ${payrollLabel} - ${branchName ?? ""}`,
    ]);
    ws.mergeCells(1, 1, 1, colCount);
    row.height = 24;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const period =
      `Período: ${formatDateToSpanishWords(startDate?.trim() ?? "—")} ` +
      `al ${formatDateToSpanishWords(endDate?.trim() ?? "—")}`;
    const row = ws.addRow([period]);
    ws.mergeCells(2, 1, 2, colCount);
    row.height = 18;
    const cell = row.getCell(1);
    cell.font = { size: 10, color: { argb: C.subtitleText } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const row = ws.addRow(activeColumns.map((col) => col.label));
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

  const grouped = groupByWorkArea(data);

  for (const [areaName, areaItems] of grouped) {
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

    for (const item of areaItems) {
      const row = ws.addRow(
        activeColumns.map((col) =>
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
      const totals = calcAreaTotalsRaw(areaItems, activeColumns);
      const label = `Total ${areaName} (${areaItems.length} colab.)`;
      const rowData = activeColumns.map((col, i) =>
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
    const totals = calcAreaTotalsRaw(data, activeColumns);
    const label = `TOTAL GENERAL (${data.length} colaboradores)`;
    const rowData = activeColumns.map((col, i) =>
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
    `reporte-nomina-${slugify(payrollLabel)}-${slugify(branchLabel)}-` +
    `${formatDateToSpanishWords(slugify(periodStart))}-a-${formatDateToSpanishWords(slugify(periodEnd))}.xlsx`;

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
