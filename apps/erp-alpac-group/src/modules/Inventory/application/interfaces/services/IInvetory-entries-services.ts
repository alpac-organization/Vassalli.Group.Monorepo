import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface IInventoryEntriesServices {
    GetInventoryEntries(payload: any) : Promise<PaginateBaseResponse<any>>;
}