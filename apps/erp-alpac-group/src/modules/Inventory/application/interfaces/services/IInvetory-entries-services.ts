import type { InventoryEntriesRequest, GetInventoryEntryDetailRequest } from "@app/modules/Inventory/domain/api-contract/requests/inventory-entries.request";
import type { PagedInventoryEntriesResponse, InventoryEntryDetail } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: InventoryEntriesRequest): Promise<PagedInventoryEntriesResponse>;
    GetInventoryEntryDetail(payload: GetInventoryEntryDetailRequest): Promise<InventoryEntryDetail>;
}
