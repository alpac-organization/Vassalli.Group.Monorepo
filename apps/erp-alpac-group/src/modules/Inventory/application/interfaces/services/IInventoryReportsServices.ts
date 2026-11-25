import type { StockDailyReport } from "@app/modules/Inventory/domain/api-contract/responses/stock-daily-report.response";
import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";
import type { OutputDetailByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-detail-by-equipment-report.response";
import type { OutputConsolidatedByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-consolidated-by-equipment-report.response";

export type StockDailyReportType = {
   company_id: string;
   module_code: string;
   branch_ids?: string[];
   area_ids?: string[];
   cost_center_ids?: string[];
   category_ids?: string[];
   usage_types?: string[];
   product_code?: string;
   product_name?: string;
};

export type EquipmentReportType = {
   company_id: string;
   module_code: string;
   from?: string;
   to?: string;
   branch_id?: string;
   category_ids?: string[];
   equipment_ids?: string[];
   product_ids?: string[];
};

export interface IInventoryReportsServices {
   GetStockDailyReport(payload: StockDailyReportType): Promise<StockDailyReport>;

   GetOutputsLineEquipmentReport(payload: EquipmentReportType): Promise<OutputLineEquipmentReport>;

   GetOutputsDetailByEquipmentReport(payload: EquipmentReportType): Promise<OutputDetailByEquipmentReport>;

   GetOutputsConsolidatedByEquipmentReport(payload: EquipmentReportType): Promise<OutputConsolidatedByEquipmentReport>;
}
