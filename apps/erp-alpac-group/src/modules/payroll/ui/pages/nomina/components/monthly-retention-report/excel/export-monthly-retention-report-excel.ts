import { THIN_BORDER } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/constants/excel-constants";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";
import type { ExportMonthlyRetentionReportExcelParams } from "../types/monthly-retention-report.types";

const COLUMNS = [
  { key: "identification_number", label: "No. Cédula", width: 18 },
  {
    key: "full_name",
    label: "NOMBRE Y APELLIDOS Ó RAZÓN SOCIAL",
    width: 40,
  },
  {
    key: "gross_monthly_income",
    label: "INGRESOS BRUTOS MENSUALES",
    width: 22,
  },
  { key: "inss_monthly", label: "VALOR COTIZACIÓN INSS", width: 22 },
  {
    key: "pension_fund",
    label: "VALOR FONDO PENSIÓN AHORRO",
    width: 24,
  },
  { key: "document_number", label: "NÚMERO DE DOCUMENTO", width: 22 },
  { key: "document_date", label: "FECHA DE DOCUMENTO", width: 20 },
  { key: "taxable_base", label: "BASE IMPONIBLE", width: 18 },
  { key: "withheld_ir", label: "VALOR RETENIDO", width: 18 },
  {
    key: "retention_rate",
    label: "ALÍCUOTA DE RETENCIÓN",
    width: 22,
  },
  { key: "retention_code", label: "CÓDIGO DE RETENCIÓN", width: 20 },
] as const;

const COL_COUNT = COLUMNS.length;
const NUMERIC_COLUMNS = new Set([3, 4, 8, 9]);

export async function exportMonthlyRetentionReportExcel({
  data,
  branchName,
}: ExportMonthlyRetentionReportExcelParams): Promise<void> {
  const { Workbook } = await import("exceljs");

  const wb = new Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Retenciones Mensual", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = COLUMNS.map((col) => ({ width: col.width }));

  {
    const row = ws.addRow(COLUMNS.map((col) => col.label));
    row.height = 28;
    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.font = { bold: true, size: 9 };
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
      item.identification_number || "—",
      item.full_name || "—",
      item.gross_monthly_income,
      item.inss_monthly,
      "",
      "",
      "",
      item.taxable_base,
      item.withheld_ir,
      "",
      item.retention_code,
    ]);

    row.height = 20;

    for (let c = 1; c <= COL_COUNT; c += 1) {
      const cell = row.getCell(c);
      cell.border = THIN_BORDER;
      cell.font = { size: 9 };
      cell.alignment = {
        vertical: "middle",
        horizontal: NUMERIC_COLUMNS.has(c) ? "right" : "left",
      };

      if (NUMERIC_COLUMNS.has(c)) {
        cell.numFmt = '#,##0.00;[Red]-#,##0.00; "-"';
      }
    }
  });

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const now = new Date().toISOString().split("T")[0];
  const branchSlug = slugify(branchName);
  link.download = `informe-retenciones-mensual-${branchSlug}-${now}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
