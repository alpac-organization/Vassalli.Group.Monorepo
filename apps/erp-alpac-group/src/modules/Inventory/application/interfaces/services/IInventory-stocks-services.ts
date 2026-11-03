import type { InventoryStockData, PagedResponseStock } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface IInventoryStocksServices
{
    GetInventoryStocks(payload: any) : Promise<PagedResponseStock<InventoryStockData>>;
}