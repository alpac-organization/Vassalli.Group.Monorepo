import type { BaseLocation } from "../../shared/base-location";
import type { GetWarehouseCapacitiesResponse } from "./get-warehouse-capacities-response";

export interface GetWarehouseDetailsResponse {
  warehouse_id: string;
  code: string;
  is_active: boolean;
  warehouse_type: string | null;
  location: BaseLocation | null;
  capacity: GetWarehouseCapacitiesResponse | null;
}