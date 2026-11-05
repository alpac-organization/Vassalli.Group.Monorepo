import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface StockControlFilters {
    category_id?:  string;
    product_code?: string;
    product_name?: string;

    page_number?:  number;
    page_size?:    number;
}

//Acciones de context menu
export interface ContextMenuItemsProps extends ActionsMenuContext {
    item: InventoryStockData;
}

//Acciones de las columnas de contexto
export interface ActionsMenuContext {
    onEditStock?: (stock: InventoryStockData) => void;
    onDeleteInventoryStock?: (stock: InventoryStockData) => void;
}

export interface InventoryStocksColumnsToTableProps {
    ActionsMenuContext: ActionsMenuContext;
}