import type { ReasonsInventoryRemovalResponse } from "../../domain/api-contract/responses/reasons-inventory-removal.reponse";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: any) : Promise<ReasonsInventoryRemovalResponse>;
}