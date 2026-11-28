import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type {
   IInventoryReportsServices,
   StockDailyReportType,
   EquipmentReportType,
   PeriodInventoryReportType,
   InventoryMovementReportType,
   KardexReportType,
} from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";
import type { StockDailyReport } from "@app/modules/Inventory/domain/api-contract/responses/stock-daily-report.response";
import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";
import type { OutputDetailByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-detail-by-equipment-report.response";
import type { OutputConsolidatedByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-consolidated-by-equipment-report.response";
import type { PeriodInventoryReport } from "@app/modules/Inventory/domain/api-contract/responses/period-inventory-report.response";

export class InventoryReportsServices implements IInventoryReportsServices {
   private readonly httpClient: IHttpHandler;

   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetStockDailyReport(payload: StockDailyReportType): Promise<StockDailyReport> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<StockDailyReport>(
         `/companies/${company_id}/modules/${module_code}/reports/stock-daily`,
         {
            params: cleanParams(rest),
            paramsSerializer: { indexes: null },
         },
      );
   }

   async GetPeriodInventoryReport(payload: PeriodInventoryReportType): Promise<PeriodInventoryReport> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<PeriodInventoryReport>(
         `/companies/${company_id}/modules/${module_code}/reports/inventory-period`,
         {
            params: cleanParams(rest),
            paramsSerializer: { indexes: null },
         },
      );
   }

   async GetInventoryMovementReportPdf(payload: InventoryMovementReportType): Promise<Blob> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<Blob>(
         `/companies/${company_id}/modules/${module_code}/reports/inventory-movements/pdf`,
         {
            params: cleanParams(rest),
            responseType: "blob",
         },
      );
   }

   async GetInventoryTurnoverReportPdf(payload: InventoryMovementReportType): Promise<Blob> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<Blob>(
         `/companies/${company_id}/modules/${module_code}/reports/inventory-turnover/pdf`,
         {
            params: cleanParams(rest),
            responseType: "blob",
         },
      );
   }

   async GetKardexReportExcel(payload: KardexReportType): Promise<Blob> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<Blob>(
         `/companies/${company_id}/modules/${module_code}/reports/kardex`,
         {
            params: cleanParams(rest),
            paramsSerializer: { indexes: null },
            responseType: "blob",
         },
      );
   }

   async GetOutputsLineEquipmentReport(payload: EquipmentReportType): Promise<OutputLineEquipmentReport> {
      return this.getEquipmentReport<OutputLineEquipmentReport>(payload, "outputs-line-equipment");
   }

   async GetOutputsDetailByEquipmentReport(payload: EquipmentReportType): Promise<OutputDetailByEquipmentReport> {
      return this.getEquipmentReport<OutputDetailByEquipmentReport>(payload, "outputs-detail-by-equipment");
   }

   async GetOutputsConsolidatedByEquipmentReport(payload: EquipmentReportType): Promise<OutputConsolidatedByEquipmentReport> {
      return this.getEquipmentReport<OutputConsolidatedByEquipmentReport>(payload, "outputs-consolidated-by-equipment");
   }

   private getEquipmentReport<T>(payload: EquipmentReportType, endpoint: string): Promise<T> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<T>(
         `/companies/${company_id}/modules/${module_code}/reports/${endpoint}`,
         {
            params: cleanParams(rest),
            paramsSerializer: { indexes: null },
         },
      );
   }
}
