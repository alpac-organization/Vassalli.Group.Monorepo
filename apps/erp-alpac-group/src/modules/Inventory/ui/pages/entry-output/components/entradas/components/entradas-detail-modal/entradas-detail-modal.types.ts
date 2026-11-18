import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export interface EntradasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: InventoryEntry | null;
}
