import type { MonthlyPurchaseReportItemDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";

export interface MonthlyPurchaseReportPdfProps {
  items: MonthlyPurchaseReportItemDto[];
  grandTotal: number;
  logoUrl?: string | null;
  year?: number;
  month?: number;
}
