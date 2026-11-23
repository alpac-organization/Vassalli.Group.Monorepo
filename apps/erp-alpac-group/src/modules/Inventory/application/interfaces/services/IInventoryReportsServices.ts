import type { StockDailyReport } from "@app/modules/Inventory/domain/api-contract/responses/stock-daily-report.response";

export interface IInventoryReportsServices {
   GetStockDailyReport(payload: {
      company_id: string;
      module_code: string;
      branch_ids?: string[];
      area_ids?: string[];
      cost_center_ids?: string[];
      category_ids?: string[];
      usage_types?: string[];
      product_code?: string;
      product_name?: string;
   }): Promise<StockDailyReport>;
}