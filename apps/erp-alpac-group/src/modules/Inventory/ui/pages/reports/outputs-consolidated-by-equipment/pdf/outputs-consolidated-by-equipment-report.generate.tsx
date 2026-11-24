import type { OutputsConsolidatedByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report.types";

export type GenerateOutputsConsolidatedByEquipmentReportPdfParams = {
   report: OutputsConsolidatedByEquipmentReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateOutputsConsolidatedByEquipmentReportPdf(
   params: GenerateOutputsConsolidatedByEquipmentReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { OutputsConsolidatedByEquipmentReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report"),
   ]);

   return pdf(
      <OutputsConsolidatedByEquipmentReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}
