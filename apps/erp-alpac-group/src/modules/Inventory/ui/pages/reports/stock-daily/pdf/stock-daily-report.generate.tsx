import type { StockDailyReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/stock-daily/pdf/stock-daily-report.types";

export type GenerateStockDailyReportPdfParams = {
   report: StockDailyReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateStockDailyReportPdf(
   params: GenerateStockDailyReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { StockDailyReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@app/modules/Inventory/ui/pages/reports/stock-daily/pdf/stock-daily-report"),
   ]);

   return pdf(
      <StockDailyReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}