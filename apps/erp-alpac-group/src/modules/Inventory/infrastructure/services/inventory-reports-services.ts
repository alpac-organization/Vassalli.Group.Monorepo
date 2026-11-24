import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type {
   IInventoryReportsServices,
   StockDailyReportType,
   EquipmentReportType,
} from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";
import type { StockDailyReport } from "@app/modules/Inventory/domain/api-contract/responses/stock-daily-report.response";
import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";

export class InventoryReportsServices implements IInventoryReportsServices {
   private readonly httpClient: IHttpHandler;

   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetStockDailyReport(payload: StockDailyReportType): Promise<StockDailyReport> {
      try {
         const { company_id, module_code, ...rest } = payload;

         return this.httpClient.get<StockDailyReport>(
            `/companies/${company_id}/modules/${module_code}/reports/stock-daily`,
            {
               params: cleanParams(rest),
               paramsSerializer: { indexes: null },
            },
         );
      } catch (error: unknown) {
         throw error;
      }
   }

   async GetOutputsLineEquipmentReport(payload: EquipmentReportType): Promise<OutputLineEquipmentReport> {
      try {
         const { company_id, module_code, ...rest } = payload;

         return this.httpClient.get<OutputLineEquipmentReport>(
            `/companies/${company_id}/modules/${module_code}/reports/outputs-line-equipment`,
            {
               params: cleanParams(rest),
               paramsSerializer: { indexes: null },
            },
         );
      } catch (error: unknown) {
         throw error;
      }
   }
}
