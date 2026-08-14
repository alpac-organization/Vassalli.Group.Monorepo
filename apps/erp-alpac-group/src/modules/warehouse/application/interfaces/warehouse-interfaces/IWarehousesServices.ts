import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
export interface IWarehouseServices {
  GetWarehouses(payload: GetWarehouseRequest): Promise<GetWarehousesResponse[]>;
  CreateWarehouse(payload: CreateWarehouseRequest): Promise<void>;
}
