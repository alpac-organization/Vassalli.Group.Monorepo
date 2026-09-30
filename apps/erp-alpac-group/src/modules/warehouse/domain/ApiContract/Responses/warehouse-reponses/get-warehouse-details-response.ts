import type { BaseLocation } from "@app/modules/warehouse/domain/ApiContract/shared/base-location";
import type { GetWarehouseCapacitiesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-capacities-response";

export interface GetWarehouseDetailsResponse {
  warehouse_id: string;
  code: string;
  is_active: boolean;
  warehouse_type: string | null;
  location: BaseLocation | null;
  capacity: GetWarehouseCapacitiesResponse | null;
}