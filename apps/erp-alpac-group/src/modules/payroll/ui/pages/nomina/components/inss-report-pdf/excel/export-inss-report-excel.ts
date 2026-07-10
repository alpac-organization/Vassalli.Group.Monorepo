import type { GetPayrollReportsInssInformationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
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
import { buildInssReportPeriodLabel } from "../utils/inss-report.utils";

export type ExportInssReportExcelParams = {
  data: GetPayrollReportsInssInformationResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string | null;
  isFortnightly: boolean;
};

const COLUMNS = [
  { key: "code", label: "Código", width: 14 },
  { key: "name", label: "Nombre", width: 32 },
  { key: "income", label: "Ingreso", width: 16 },
  { key: "absences", label: "Ausencias", width: 16 },
  { key: "inssLab", label: "INSS Laboral", width: 16 },
  { key: "inssPatronal", label: "INSS Patronal", width: 16 },
  { key: "inatec", label: "INATEC", width: 16 },
  { key: "total", label: "Total", width: 16 },
] as const;

const COL_COUNT = COLUMNS.length;
const HEADER_ROW = 3;
const LOGO_COLUMN_INDEX = COL_COUNT;

export async function exportInssReportExcel({
  data,
  branchName,
  startDate,
  endDate,
  logoUrl,
  isFortnightly,
}: ExportInssReportExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const totalIncome = data.reduce((acc, item) => acc + (item.income ?? 0), 0);
  const totalAbsences = data.reduce(
    (acc, item) => acc + (item.absences ?? 0),
    0,
  );
  const totalInssLab = data.reduce(
    (acc, item) => acc + (item.inss_lab ?? 0),
    0,
  );
  const totalInssPatronal = data.reduce(
    (acc, item) => acc + (item.inss_patronal ?? 0),
    0,
  );
  const totalInatec = data.reduce((acc, item) => acc + (item.inatec ?? 0), 0);
  const totalAmount = data.reduce((acc, item) => acc + (item.total ?? 0), 0);

  const reportTitle = isFortnightly
    ? "Reporte INSS Quincenal"
    : "Reporte INSS Mensual";

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Reporte INSS", {
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
    const row = ws.addRow([`${reportTitle} - ${branchName ?? ""}`]);
    ws.mergeCells(1, 1, 1, COL_COUNT);
    row.height = LOGO_MAX_HEIGHT + 8;
    const cell = row.getCell(1);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  {
    const periodLabel =
      buildInssReportPeriodLabel(startDate, endDate, isFortnightly) ??
      "Período no disponible";
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
    const row = ws.addRow([
      item.collaborator_code || "—",
      item.collaborator_fullname || "—",
      item.income ?? 0,
      item.absences ?? 0,
      item.inss_lab ?? 0,
      item.inss_patronal ?? 0,
      item.inatec ?? 0,
      item.total ?? 0,
    ]);

    row.height = 20;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { size: 9 };
      cell.alignment = {
        vertical: "middle",
        horizontal: c >= 3 ? "right" : "left",
      };

      if (c >= 3) {
        cell.numFmt = '#,##0.00;[Red]-#,##0.00; "-"';
      }
    }
  });

  {
    const row = ws.addRow([
      "Totales",
      "",
      totalIncome,
      totalAbsences,
      totalInssLab,
      totalInssPatronal,
      totalInatec,
      totalAmount,
    ]);
    row.height = 22;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { bold: true, size: 9, color: { argb: C.globalText } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.globalBg },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: c >= 3 ? "right" : "center",
      };

      if (c >= 3) {
        cell.numFmt = '#,##0.00;[Red]-#,##0.00; "-"';
      }
    }
    ws.mergeCells(row.number, 1, row.number, 2);
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
    } catch {
      console.warn("No se pudo agregar el logo en Reporte INSS");
    }
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const now = new Date().toISOString().split("T")[0];
  const branchSlug = slugify(branchName);
  const typeSlug = isFortnightly ? "quincenal" : "mensual";
  link.download = `reporte-inss-${typeSlug}-${branchSlug}-${now}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
