import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryReportsServices } from "../../application/interfaces/services/IInventoryReportsServices";
import type { StockDailyReport } from "../../domain/api-contract/responses/stock-daily-report.response";

export class InventoryReportsServices implements IInventoryReportsServices {
   private readonly httpClient: IHttpHandler;

   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetStockDailyReport(payload: {
      company_id: string;
      module_code: string;
      branch_ids?: string[];
      area_ids?: string[];
      cost_center_ids?: string[];
      category_ids?: string[];
      usage_types?: string[];
      product_code?: string;
      product_name?: string;
   }): Promise<StockDailyReport> {
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
}