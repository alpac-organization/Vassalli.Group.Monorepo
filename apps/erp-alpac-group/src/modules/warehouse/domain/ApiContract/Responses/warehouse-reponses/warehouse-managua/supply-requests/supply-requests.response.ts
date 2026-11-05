import type { ReasonUse } from "@app/core/enums/reason-use.enum";
import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type {
  WorkAreaInformation,
  CostCenterInformation,
  BranchInformation,
  WarehouseInformation,
  OperationalOrderInformation,
} from "@app/shared/interfaces/organization-information/organization-information";

export interface SupplyRequestItemDetail {
  supply_request_item_id: string;
  product_stock_id: string;
  product_stock_name: string;
  amount: number;
}

export interface SupplyRequestDto {
  supply_request_id: string;
  supply_request_code: string;
  po_code: string | null;
  reason_use: ReasonUse;
  justification: string | null;
  outflow_status: OutflowStatus;
  requested_by_user_id: string;
  requested_by_user_name: string;
  work_area_name: string | null;
  warehouse_code: string;
  created_at: string;
  items_count: number;
}

export interface SupplyRequestDetailDto extends SupplyRequestDto {
  work_area_information: WorkAreaInformation;
  cost_center_information: CostCenterInformation;
  branch_information: BranchInformation;
  warehouse_information: WarehouseInformation;
  operational_order_information: OperationalOrderInformation;
  items: SupplyRequestItemDetail[];
  approved_by_user_chief_name: string | null;
  annulled_by_user_chief_name: string | null;
}

export type PagedSupplyRequestsResponse = PaginateBaseResponse<SupplyRequestDto>;
