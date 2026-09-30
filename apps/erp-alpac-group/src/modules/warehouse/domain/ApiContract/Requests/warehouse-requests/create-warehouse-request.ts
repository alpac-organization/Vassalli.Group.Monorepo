import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { WarehouseTypeValue } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { BaseCapacities } from "@app/modules/warehouse/domain/ApiContract/shared/base-capacities";
import type { BaseLocation } from "@app/modules/warehouse/domain/ApiContract/shared/base-location";

export interface CreateWarehouseRequest extends BaseRequest, BaseCapacities {
	code: string;
	warehouse_type: WarehouseTypeValue;
	warehouse_location: BaseLocation
}
