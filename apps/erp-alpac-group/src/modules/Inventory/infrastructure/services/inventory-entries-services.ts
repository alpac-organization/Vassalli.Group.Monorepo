import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryEntriesServices } from "@app/modules/Inventory/application/interfaces/services/IInvetory-entries-services";
import type { InventoryEntriesRequest, GetInventoryEntryDetailRequest, RegisterInventoryEntryRequest } from "@app/modules/Inventory/domain/api-contract/requests/inventory-entries.request";
import type { PagedInventoryEntriesResponse, InventoryEntryDetail, InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export class InventoryEntriesServices implements IInventoryEntriesServices {
  private readonly httpClient: IHttpHandler;

  constructor(httpClient: IHttpHandler) {
    this.httpClient = httpClient;
  }

  async GetInventoryEntries(payload: InventoryEntriesRequest): Promise<PagedInventoryEntriesResponse> {
    const { company_id, module_code, ...rest } = payload;

    return this.httpClient.get<PagedInventoryEntriesResponse>(
      `/companies/${company_id}/modules/${module_code}/inventory-entries`,
      {
        params: cleanParams(rest),
      },
    );
  }

  async GetInventoryEntryDetail(payload: GetInventoryEntryDetailRequest): Promise<InventoryEntryDetail> {
    const { company_id, module_code, inventory_entry_id } = payload;

    return this.httpClient.get<InventoryEntryDetail>(
      `/companies/${company_id}/modules/${module_code}/inventory-entries/${inventory_entry_id}/details`,
    );
  }

  async RegisterInventoryEntry(payload: RegisterInventoryEntryRequest): Promise<InventoryEntry> {
    const { company_id, module_code, inventory_entry_id, ...body } = payload;

    return this.httpClient.post<InventoryEntry>(
      `/companies/${company_id}/modules/${module_code}/inventory-entries/${inventory_entry_id}/register`,
      body,
    );
  }
}
