import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { KardexMovementsData } from "../../domain/api-contract/responses/kardex-movements.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { InventoryStocksRequest } from "../../domain/api-contract/requests/inventory-stock.request";
import type { PatchInventoryStockRequest } from "../../domain/api-contract/requests/patch-inventory-stock.request";
import type { KardexMovementsRequest } from "../../domain/api-contract/requests/kardex-movements.request";
import type { IInventoryStocksServices } from "../../application/interfaces/services/IInventory-stocks-services";
import type { InventoryStockData, PagedResponseStock } from "../../domain/api-contract/responses/inventory-stocks.response";

export class InventoryStocksServices implements IInventoryStocksServices {
   private readonly httpClient: IHttpHandler;
   
   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   // All services here
   async GetInventoryStocks(payload: InventoryStocksRequest) : Promise<PagedResponseStock<InventoryStockData>>{
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<PagedResponseStock<InventoryStockData>>(`/companies/${company_id}/modules/${module_code}/inventory-stock`, {
         params: cleanParams(rest),
      });
   }

   async GetKardexMovements(payload: KardexMovementsRequest) : Promise<PaginateBaseResponse<KardexMovementsData>>{
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<PaginateBaseResponse<KardexMovementsData>>(`/companies/${company_id}/modules/${module_code}/kardex-movements`, {
         params: cleanParams(rest),
      });
   }

   async PatchInventoryStock(payload: PatchInventoryStockRequest) : Promise<void>{
      const { company_id, module_code, inventory_stock_id, ...rest } = payload;

      await this.httpClient.patch<void>(`/companies/${company_id}/modules/${module_code}/inventory-stock/${inventory_stock_id}`, rest);
   }
}