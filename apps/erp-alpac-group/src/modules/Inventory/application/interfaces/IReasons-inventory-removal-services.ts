import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { ReasonsInventoryRemovalResponse } from "../../domain/api-contract/responses/reasons-inventory-removal.reponse";

export interface IReasonsInventoryRemovalServices
{
    GetReasonsInventoryRemoval(payload: any) : Promise<PaginateBaseResponse<ReasonsInventoryRemovalResponse>>;
}