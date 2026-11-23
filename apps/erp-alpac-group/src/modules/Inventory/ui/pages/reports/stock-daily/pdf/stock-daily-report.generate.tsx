import type { StockDailyReportPdfProps } from "./stock-daily-report.types";

export type GenerateStockDailyReportPdfParams = {
   report: StockDailyReportPdfProps["report"];
   logoUrl?: string | null;
};

export async function generateStockDailyReportPdf(
   params: GenerateStockDailyReportPdfParams,
): Promise<Blob> {
   const [{ pdf }, { StockDailyReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("./stock-daily-report"),
   ]);

   return pdf(
      <StockDailyReportPdf report={params.report} logoUrl={params.logoUrl} />,
   ).toBlob();
}