import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface InventoryEntriesRequest extends BaseRequest {
   readonly branch_id?: string;
   readonly entry_status?: number;
   readonly page_number?: number;
   readonly page_size?: number;
}