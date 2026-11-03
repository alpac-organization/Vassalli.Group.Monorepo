import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";
import type { InventoryStocksRequest } from "@app/modules/Inventory/domain/api-contract/requests/inventory-stock.request";
import type { KardexMovementsRequest } from "@app/modules/Inventory/domain/api-contract/requests/kardex-movements.request";
import type { InventoryStockData, PagedResponseStock } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface IInventoryStocksServices
{
    GetInventoryStocks(payload: InventoryStocksRequest) : Promise<PagedResponseStock<InventoryStockData>>;
    GetKardexMovements(payload: KardexMovementsRequest) : Promise<PaginateBaseResponse<KardexMovementsData>>;

    // GetKardexMovementsDetails(payload: any) : Promise<PagedResponseStock<any>>;
    // UpdateStockLevels(payload: any) : Promise<PagedResponseStock<any>>;
}