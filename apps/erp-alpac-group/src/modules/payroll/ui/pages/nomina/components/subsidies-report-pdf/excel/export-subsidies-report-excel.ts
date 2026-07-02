import type { SubsidyHistoryDto } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
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

export type ExportSubsidiesReportExcelParams = {
  data: SubsidyHistoryDto[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string | null;
};

const COLUMNS = [
  { key: "code", label: "Código", width: 14 },
  { key: "name", label: "Empleado", width: 32 },
  { key: "days", label: "Día", width: 10 },
  { key: "boleta", label: "Boleta", width: 14 },
  { key: "typeSubsidy", label: "Tipo Subsidio", width: 24 },
  { key: "startDate", label: "Fecha", width: 14 },
  { key: "endDate", label: "Fecha Fin", width: 14 },
  { key: "assumed", label: "Asume la Emp", width: 16 },
  { key: "reimbursement", label: "% Reembolsa INSS", width: 18 },
] as const;

const COL_COUNT = COLUMNS.length;
const HEADER_ROW = 3;
const LOGO_COLUMN_INDEX = COL_COUNT;

export async function exportSubsidiesReportExcel({
  data,
  branchName,
  startDate,
  endDate,
  logoUrl,
}: ExportSubsidiesReportExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const totalCompanyAssumed = data.reduce(
    (acc, item) => acc + (item.company_assumed_amount ?? 0),
    0,
  );
  const totalInssReimbursement = data.reduce(
    (acc, item) => acc + (item.inss_reimbursement_amount ?? 0),
    0,
  );

  const reportTitle = "Empleados de Subsidio";

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Subsidios", {
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
      startDate && endDate
        ? `Periodo del ${formatDateToSpanishWords(startDate)} al ${formatDateToSpanishWords(endDate)}`
        : "Período no disponible";
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
      item.collaborator_full_name || "—",
      item.amount_days ?? 0,
      item.reference_number || "—",
      item.type_subsidy_name || "—",
      item.start_date || "—",
      item.end_date || "—",
      item.company_assumed_amount ?? 0,
      item.inss_reimbursement_amount ?? 0,
    ]);

    row.height = 20;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { size: 9 };
      cell.alignment = {
        vertical: "middle",
        horizontal:
          c >= 8
            ? "right"
            : c === 3 || c === 4 || c === 6 || c === 7
              ? "center"
              : "left",
      };

      if (c >= 8) {
        cell.numFmt = '#,##0.00;[Red]-#,##0.00; "-"';
      }
    }
  });

  {
    const row = ws.addRow([
      "Total",
      "",
      "",
      "",
      "",
      "",
      "",
      totalCompanyAssumed,
      totalInssReimbursement,
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
        horizontal: c >= 8 ? "right" : "center",
      };

      if (c >= 8) {
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
      console.warn("No se pudo agregar el logo en Reporte de Subsidios");
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
  link.download = `reporte-subsidios-${branchSlug}-${now}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
