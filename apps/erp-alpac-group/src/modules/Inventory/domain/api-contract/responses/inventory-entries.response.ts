import type { EntryStatus } from "@app/core/enums/entry-status.enum";
import type { EntryType } from "@app/core/enums/entry-type.enum";
import type {
  BranchInformation,
  WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface InventoryEntry {
  inventory_entry_id: string;
  code: string | null;
  entry_status: EntryStatus;
  branch_information: BranchInformation | null;
}

export interface InventoryEntryPurchaseRequestItem {
  purchase_request_item_id: string;
  quantity: number;
  quantity_unit: number | null;
  description: string | null;
  justification: string | null;
  product_name: string | null;
  product_code: string | null;
  unit_measure_name: string | null;
  unit_measure_symbol: string | null;
}

export interface InventoryEntryDetail extends InventoryEntry {
  entry_type: EntryType;
  observations: string | null;
  additional_data: string | null;
  created_at: string;
  work_area_information: WorkAreaInformation | null;
  purchase_request_information: GetPurchaseRequestResponse | null;
  purchase_request_items: InventoryEntryPurchaseRequestItem[];
}

export type PagedInventoryEntriesResponse = PaginateBaseResponse<InventoryEntry>;
