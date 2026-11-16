import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type {
  WorkAreaInformation,
  CostCenterInformation,
  BranchInformation,
  MachineryInformation,
  CustomerInformation,
} from "@app/shared/interfaces/organization-information/organization-information";

export interface FuelRequestDto {
  fuel_request_id: string;
  fuel_request_code: string;
  outflow_status: OutflowStatus;
  requested_by_user_id: string;
  requested_by_user_name: string;
  machinery_code: string;
  machinery_brand: string;
  machinery_model: string | null;
  justification: string | null;
  created_at: string;
  requested_quantity?: number;
}

export interface FuelRequestDetailDto extends FuelRequestDto {
  work_area_information: WorkAreaInformation;
  cost_center_information: CostCenterInformation;
  branch_information: BranchInformation;
  machinery_information: MachineryInformation;
  customer_information: CustomerInformation;
  product_stock_id: string;
  product_stock_name: string;
  requested_quantity: number;
  unit_measure_symbol: string;
  requested_quantity_litters: number;
  mileage: number | null;
  engine_hours: number | null;
  approved_by_user_chief_name: string | null;
  annulled_by_user_chief_name: string | null;
}

export type PagedFuelRequestsResponse = PaginateBaseResponse<FuelRequestDto>;
