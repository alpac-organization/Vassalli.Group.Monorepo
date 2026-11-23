import type { InventoryEntry, InventoryEntryDetail } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export interface EntradasRegisterModalProps {
  isOpen: boolean;
  entry: InventoryEntry | null;
  onClose: () => void;
  onRegistered: (entry: InventoryEntry) => void;
  onError: (error: unknown) => void;
}

export interface EntradasRegisterFormState {
  invoiceNumber: string;
  invoiceDate: string | null;
  observations: string;
  costCenters: Record<string, string>;
}

export type EntradasRegisterDetail = InventoryEntryDetail;
