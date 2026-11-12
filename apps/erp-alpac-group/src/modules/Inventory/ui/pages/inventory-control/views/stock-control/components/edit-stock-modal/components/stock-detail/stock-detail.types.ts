import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface StockDetailProps {
   stock: InventoryStockData;
}