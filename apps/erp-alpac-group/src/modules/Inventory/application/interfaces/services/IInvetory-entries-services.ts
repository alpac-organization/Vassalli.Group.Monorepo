import type {
    InventoryEntriesRequest,
    GetInventoryEntryDetailRequest,
    RegisterInventoryEntryRequest,
    AnnulInventoryEntryRequest,
} from "@app/modules/Inventory/domain/api-contract/requests/inventory-entries.request";
import type { PagedInventoryEntriesResponse, InventoryEntryDetail, InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: InventoryEntriesRequest): Promise<PagedInventoryEntriesResponse>;
    GetInventoryEntryDetail(payload: GetInventoryEntryDetailRequest): Promise<InventoryEntryDetail>;
    RegisterInventoryEntry(payload: RegisterInventoryEntryRequest): Promise<InventoryEntry>;
    AnnulInventoryEntry(payload: AnnulInventoryEntryRequest): Promise<InventoryEntry>;
}
