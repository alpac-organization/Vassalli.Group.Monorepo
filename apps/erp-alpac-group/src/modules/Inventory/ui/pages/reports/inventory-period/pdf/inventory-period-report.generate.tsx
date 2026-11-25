import type { InventoryPeriodReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/inventory-period/pdf/inventory-period-report";

export async function generateInventoryPeriodReportPdf(
   params: InventoryPeriodReportPdfProps,
): Promise<Blob> {
   const [{ pdf }, { InventoryPeriodReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@app/modules/Inventory/ui/pages/reports/inventory-period/pdf/inventory-period-report"),
   ]);

   return pdf(
      <InventoryPeriodReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}
