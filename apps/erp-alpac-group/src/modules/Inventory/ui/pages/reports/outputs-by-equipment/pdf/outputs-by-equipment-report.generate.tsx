import type { OutputsByEquipmentReportPdfProps } from "./outputs-by-equipment-report.types";

export type GenerateOutputsByEquipmentReportPdfParams = {
   report: OutputsByEquipmentReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateOutputsByEquipmentReportPdf(
   params: GenerateOutputsByEquipmentReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { OutputsByEquipmentReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("./outputs-by-equipment-report"),
   ]);

   return pdf(
      <OutputsByEquipmentReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}