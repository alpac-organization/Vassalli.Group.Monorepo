import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

export interface DeleteProductModalProps {
   isOpen:               boolean;
   onClose:              () => void;
   stockSelected:        InventoryStockData | null;
   handleRequestSuccess: (message: string) => void;
   handleRequestError:   (message: string) => void;
}