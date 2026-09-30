import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { WarehouseTypeValue } from "../../../enums/warehouse.enum";
import type { BaseCapacities } from "../../shared/base-capacities";
import type { BaseLocation } from "../../shared/base-location";

export interface UpdateWarehouseDetailsRequest extends BaseRequest {
   warehouse_id: string;
   code: string;
   is_active: boolean;
   warehouse_type: WarehouseTypeValue;
   location: BaseLocation,
   capacity: BaseCapacities
}