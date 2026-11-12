import type { InventoryEntriesRequest } from "@app/modules/Inventory/domain/api-contract/requests/inventory-entries.request";
import type { InventoryEntryData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface IInventoryEntriesServices {
   GetInventoryEntries(payload: InventoryEntriesRequest): Promise<PaginateBaseResponse<InventoryEntryData[]>>;
}