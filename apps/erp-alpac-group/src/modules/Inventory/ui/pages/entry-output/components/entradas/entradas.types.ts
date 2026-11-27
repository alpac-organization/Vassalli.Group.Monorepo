import type { EntryStatus } from "@app/core/enums/entry-status.enum";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export interface ActionsMenuContext {
  canAnnulEntry?: boolean;
  onViewEntry?: (entry: InventoryEntry) => void;
  onRegisterEntry?: (entry: InventoryEntry) => void;
  onAnnulEntry?: (entry: InventoryEntry) => void;
}

export interface ContextMenuItemsProps extends ActionsMenuContext {
  item: InventoryEntry;
}

export interface InventoryEntriesColumnsToTableProps {
  ActionsMenuContext?: ActionsMenuContext;
}

export interface EntradasFilters {
  branch_id?: string;
  work_area_id?: string;
  entry_code?: string;
  purchase_request_code?: string;
  entry_status?: EntryStatus | null;

  page_number?: number;
  page_size?: number;
}

export const DEFAULT_ENTRADAS_FILTERS: EntradasFilters = {
  page_number: 1,
  page_size: 10,
};
