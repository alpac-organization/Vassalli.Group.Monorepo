import type { AssignWarehouseZoneRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/assign-warehouse-zone-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { GetWarehouseZoneRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-zones-request";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";

/**
 * @interface IWarehouseServices
 * @description Define el contrato para la gestión de los almacenes.
 */
export interface IWarehouseServices {

   GetWarehouses(payload: GetWarehouseRequest): Promise<any>;

   CreateWarehouse(payload: CreateWarehouseRequest): Promise<void>;

   GetWarehouseZones(payload: GetWarehouseZoneRequest): Promise<any>;

   AssignWarehouseZone(payload: AssignWarehouseZoneRequest): Promise<void>;
}