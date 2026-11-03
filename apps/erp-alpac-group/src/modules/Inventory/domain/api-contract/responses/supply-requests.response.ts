import type { ReasonUse } from "@app/core/enums/reason-use.enum";
import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export interface WorkAreaInformation {
  work_area_id: string;
  work_area_code: number;
  description: string | null;
  work_area_name: string | null;
  cost_centers?: CostCenterInformation[];
}

export interface CostCenterInformation {
  cost_center_id: string;
  description: string | null;
  cost_center_name: string;
  coil_code: number;
  cost_center_code: string;
}

export interface BranchInformation {
  branch_id: string;
  branch_code: string | null;
  branch_name: string | null;
  company_alias: string | null;
}

export interface WarehouseInformation {
  warehouse_id: string;
  code: string;
  warehouse_type: number;
}

export interface OperationalOrderInformation {
  operational_order_id: string;
  po_code: string | null;
  packages_count: number | null;
  is_alerted: boolean;
}

export interface SupplyRequestItemDetail {
  supply_request_item_id: string;
  product_stock_id: string;
  product_stock_name: string;
  amount: number;
}

export interface SupplyRequestDto {
  supply_request_id: string;
  supply_request_code: string;
  reason_use: ReasonUse;
  justification: string | null;
  outflow_status: OutflowStatus;
  requested_by_user_id: string;
  requested_by_user_name: string;
  items_count: number;
}

export interface SupplyRequestDetailDto extends SupplyRequestDto {
  work_area_information: WorkAreaInformation;
  cost_center_information: CostCenterInformation;
  branch_information: BranchInformation;
  warehouse_information: WarehouseInformation;
  operational_order_information: OperationalOrderInformation;
  items: SupplyRequestItemDetail[];
}

export interface PagedSupplyRequestsResponse {
  data: SupplyRequestDto[];
  page_number: number;
  page_size: number;
  total: number;
}
