import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface EditStockModalProps {
    isOpen:         boolean;
    stockSelected:  InventoryStockData | null;
    onClose?:       () => void;
    onRequestSuccess?: (message: string) => void;
    onRequestError?: (message: string) => void;
}