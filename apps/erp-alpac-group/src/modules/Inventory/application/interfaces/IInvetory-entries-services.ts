import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { ReasonsInventoryRemovalResponse } from "../../domain/api-contract/responses/reasons-inventory-removal.reponse";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: any) : Promise<PaginateBaseResponse<ReasonsInventoryRemovalResponse>>;
}