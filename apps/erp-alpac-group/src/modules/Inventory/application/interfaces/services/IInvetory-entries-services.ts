import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { ReasonsInventoryRemovalRequest } from "@app/modules/Inventory/domain/api-contract/requests/reasons-inventory-removal.request";
import type { ReasonsInventoryRemovalResponse } from "../../../domain/api-contract/responses/reasons-inventory-removal.reponse";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: ReasonsInventoryRemovalRequest) : Promise<PaginateBaseResponse<ReasonsInventoryRemovalResponse>>;
}