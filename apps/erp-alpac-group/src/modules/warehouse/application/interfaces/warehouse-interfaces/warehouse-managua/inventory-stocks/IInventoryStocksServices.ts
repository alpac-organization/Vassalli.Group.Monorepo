import type { GetInventoryStocksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/inventory-stocks/get-inventory-stocks.request";
import type { GetInventoryStocksResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";

export interface IInventoryStocksServices {
  getInventoryStocks(
    payload: GetInventoryStocksRequest,
  ): Promise<GetInventoryStocksResponse>;
}
