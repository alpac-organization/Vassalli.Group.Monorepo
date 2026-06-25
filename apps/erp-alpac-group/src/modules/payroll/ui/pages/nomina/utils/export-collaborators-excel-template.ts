import * as XLSX from "xlsx";
import { slugify } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/excel-helper";

export type CollaboratorExcelTemplateRow = {
  identificacion: string;
  nombre: string;
  valor: number;
};

export type ExportCollaboratorsExcelTemplateParams = {
  rows: CollaboratorExcelTemplateRow[];
  branchName?: string | null;
};

export async function exportCollaboratorsExcelTemplate({
  rows,
  branchName,
}: ExportCollaboratorsExcelTemplateParams): Promise<void> {
  const sheetData: (string | number)[][] = [
    ["identificacion", "nombre", "valor"],
    ...rows.map((row) => [row.identificacion, row.nombre, row.valor]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!cols"] = [{ wch: 22 }, { wch: 40 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const branchLabel = slugify(branchName?.trim() || "nomina");
  const fileName = `plantilla-colaboradores-${branchLabel}.xlsx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
