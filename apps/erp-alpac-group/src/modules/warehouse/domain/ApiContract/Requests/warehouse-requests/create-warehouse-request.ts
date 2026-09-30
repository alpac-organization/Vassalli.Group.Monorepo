import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { WarehouseTypeValue } from "../../../enums/warehouse.enum";
import type { BaseCapacities } from "../../shared/base-capacities";
import type { BaseLocation } from "../../shared/base-location";

export interface CreateWarehouseRequest extends BaseRequest, BaseCapacities {
	code: string;
	warehouse_type: WarehouseTypeValue;
	warehouse_location: BaseLocation
}
