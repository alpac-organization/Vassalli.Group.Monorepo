import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryEntriesServices } from "../../application/interfaces/services/IInventory-entries-services";
import type { InventoryEntriesRequest } from "../../domain/api-contract/requests/inventory-entries.request";
import type { InventoryEntryData } from "../../domain/api-contract/responses/inventory-entries.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export class InventoryEntriesServices implements IInventoryEntriesServices {
   private readonly httpClient: IHttpHandler;

   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetInventoryEntries(payload: InventoryEntriesRequest): Promise<PaginateBaseResponse<InventoryEntryData[]>> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<PaginateBaseResponse<InventoryEntryData[]>>(`/companies/${company_id}/modules/${module_code}/inventory-entries`, {
         params: cleanParams(rest),
      });
   }
}