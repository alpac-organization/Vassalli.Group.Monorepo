import type { OutputsByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report.types";

export type GenerateOutputsByEquipmentReportPdfParams = {
   report: OutputsByEquipmentReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateOutputsByEquipmentReportPdf(
   params: GenerateOutputsByEquipmentReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { OutputsByEquipmentReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report"),
   ]);

   return pdf(
      <OutputsByEquipmentReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}