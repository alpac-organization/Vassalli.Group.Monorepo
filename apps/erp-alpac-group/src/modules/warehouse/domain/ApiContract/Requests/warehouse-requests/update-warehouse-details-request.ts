import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { WarehouseTypeValue } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { BaseCapacities } from "@app/modules/warehouse/domain/ApiContract/shared/base-capacities";
import type { BaseLocation } from "@app/modules/warehouse/domain/ApiContract/shared/base-location";

export interface UpdateWarehouseDetailsRequest extends BaseRequest {
   warehouse_id: string;
   code: string;
   is_active: boolean;
   warehouse_type: WarehouseTypeValue;
   location: BaseLocation,
   capacity: BaseCapacities
}
