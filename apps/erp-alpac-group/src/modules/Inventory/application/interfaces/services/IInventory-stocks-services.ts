import type { InventoryStocksRequest } from "@app/modules/Inventory/domain/api-contract/requests/inventory-stock.request";
import type { PatchInventoryStockRequest } from "@app/modules/Inventory/domain/api-contract/requests/patch-inventory-stock.request";
import type { InventoryStockData, PagedResponseStock } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface IInventoryStocksServices
{
    GetInventoryStocks(payload: InventoryStocksRequest) : Promise<PagedResponseStock<InventoryStockData>>;

    PatchInventoryStock(payload: PatchInventoryStockRequest) : Promise<void>;
}