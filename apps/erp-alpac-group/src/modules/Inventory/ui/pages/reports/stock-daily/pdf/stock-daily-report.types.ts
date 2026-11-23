import type { StockDailyReport } from "@app/modules/Inventory/domain/api-contract/responses/stock-daily-report.response";

export type StockDailyReportPdfProps = {
   report: StockDailyReport;
   logoUrl?: string | null;
};