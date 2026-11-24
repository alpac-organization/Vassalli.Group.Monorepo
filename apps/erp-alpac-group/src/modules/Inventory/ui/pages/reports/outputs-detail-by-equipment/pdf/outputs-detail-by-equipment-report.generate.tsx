import type { OutputsDetailByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report.types";

export type GenerateOutputsDetailByEquipmentReportPdfParams = {
   report: OutputsDetailByEquipmentReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateOutputsDetailByEquipmentReportPdf(
   params: GenerateOutputsDetailByEquipmentReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { OutputsDetailByEquipmentReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report"),
   ]);

   return pdf(
      <OutputsDetailByEquipmentReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}
