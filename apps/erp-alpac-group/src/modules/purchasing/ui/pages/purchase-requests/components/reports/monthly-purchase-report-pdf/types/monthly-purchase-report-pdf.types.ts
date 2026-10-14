import type { MonthlyPurchaseReportItemDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";

export interface MonthlyPurchaseReportPdfProps {
	items: MonthlyPurchaseReportItemDto[];
	logoUrl?: string | null;
	/** Optional override; derived from items when omitted. */
	year?: number;
	month?: number;
}
