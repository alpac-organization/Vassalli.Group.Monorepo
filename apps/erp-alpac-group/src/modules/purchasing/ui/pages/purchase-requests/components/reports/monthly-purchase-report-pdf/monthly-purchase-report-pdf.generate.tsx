import type { MonthlyPurchaseReportItemDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";

export type GenerateMonthlyPurchaseReportPdfParams = {
  items: MonthlyPurchaseReportItemDto[];
  grandTotal: number;
  logoUrl?: string | null;
  year?: number;
  month?: number;
};

export async function generateMonthlyPurchaseReportPdf(
  params: GenerateMonthlyPurchaseReportPdfParams,
): Promise<Blob> {
  const [{ pdf }, { MonthlyPurchaseReportPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./monthly-purchase-report-pdf"),
  ]);

  return pdf(
    <MonthlyPurchaseReportPdf
      items={params.items}
      grandTotal={params.grandTotal}
      logoUrl={params.logoUrl}
      year={params.year}
      month={params.month}
    />,
  ).toBlob();
}
