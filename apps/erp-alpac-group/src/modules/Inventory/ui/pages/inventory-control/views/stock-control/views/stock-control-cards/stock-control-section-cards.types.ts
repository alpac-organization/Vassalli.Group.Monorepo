import type { InventoryStockData, PagedResponseStock } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface StockControlSectionCardsProps {
    data: PagedResponseStock<InventoryStockData> | undefined;
}