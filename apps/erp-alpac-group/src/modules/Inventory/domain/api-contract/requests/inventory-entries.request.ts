import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { EntryStatus } from "@app/core/enums/entry-status.enum";

export interface InventoryEntriesRequest extends BaseRequest {
  branch_id?: string;
  work_area_id?: string;
  entry_status?: EntryStatus | null;
  entry_code?: string;
  purchase_request_code?: string;

  page_number?: number;
  page_size?: number;
}

export interface GetInventoryEntryDetailRequest extends BaseRequest {
  inventory_entry_id: string;
}

export interface RegisterInventoryEntryItemRequest {
  purchase_order_item_id: string;
  cost_center_id?: string;
}

export interface RegisterInventoryEntryRequest extends BaseRequest {
  inventory_entry_id: string;
  invoice_number: string;
  invoice_date?: string | null;
  observations?: string | null;
  evidence_images_base64: string[];
  items?: RegisterInventoryEntryItemRequest[];
}

export interface AnnulInventoryEntryRequest extends BaseRequest {
  inventory_entry_id: string;
  reason: string;
}
