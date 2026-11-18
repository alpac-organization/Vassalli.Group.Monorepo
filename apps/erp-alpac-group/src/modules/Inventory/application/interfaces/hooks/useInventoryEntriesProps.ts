import type {
  InventoryEntriesRequest,
  GetInventoryEntryDetailRequest,
} from "@app/modules/Inventory/domain/api-contract/requests/inventory-entries.request";

export interface useInventoryEntriesProps {
  payloadGetInventoryEntriesRequest?: InventoryEntriesRequest;
  payloadGetInventoryEntryDetailRequest?: GetInventoryEntryDetailRequest;
}
