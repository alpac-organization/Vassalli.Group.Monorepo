import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { EntryStatus } from "@app/core/enums/entry-status.enum";

export interface InventoryEntriesRequest extends BaseRequest {
  branch_id?: string;
  entry_status?: EntryStatus | null;
  entry_code?: string;
  purchase_request_code?: string;

  page_number?: number;
  page_size?: number;
}

export interface GetInventoryEntryDetailRequest extends BaseRequest {
  inventory_entry_id: string;
}
