import type { EntryType } from "@app/core/enums/entry-type.enum";
import type { EntryStatus } from "@app/core/enums/entry-status.enum";
import type {
  BranchInformation,
  WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface InventoryEntry {
  inventory_entry_id:     string;
  code:                   string | null;
  purchase_request_code:  string | null;
  created_at:             string;
  entry_type:             EntryType;
  entry_status:           EntryStatus;
  branch_information:     BranchInformation   | null;
  work_area_information:  WorkAreaInformation | null;
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

export interface InventoryEntryItemDetail {
  purchase_order_item_id: string | null;
  purchase_request_item_id: string | null;
  quotation_id: string | null;
  product_id: string;
  product_name: string | null;
  product_code: string | null;
  quantity: number;
  unit_price: number;
  unit_measure_id: string;
  unit_measure_name: string | null;
  unit_measure_symbol: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
}

export interface InventoryEntryDetail extends InventoryEntry {
  observations: string | null;
  additional_data: string | null;
  work_area_information: WorkAreaInformation | null;
  purchase_request_information: GetPurchaseRequestResponse | null;
  purchase_request_items: InventoryEntryPurchaseRequestItem[];
  purchase_order_id: string | null;
  supplier_id:       string | null;
  supplier_name:     string | null;
  items:             InventoryEntryItemDetail[];
}

export type PagedInventoryEntriesResponse = PaginateBaseResponse<InventoryEntry>;
