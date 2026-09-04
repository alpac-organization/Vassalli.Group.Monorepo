import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
import type { GetCustomBranchesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-custom-branches";
import type { GetCustomBranchesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
import type { GetSubwarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-subwarehouse.req";
import type { GetSubwarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-subwarehouses";
import type { GetWarehouseByIdRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-by-id.req";
import type { WarehouseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-by-id";

export interface IWarehouseServices {
  GetWarehouses(payload: GetWarehouseRequest): Promise<GetWarehousesResponse>;
  GetWarehouseById(
    payload: GetWarehouseByIdRequest,
  ): Promise<WarehouseDetailResponse>;
  CreateWarehouse(payload: CreateWarehouseRequest): Promise<void>;
  GetSubWarehouses(
    payload: GetSubwarehouseRequest,
  ): Promise<GetSubwarehousesResponse>;
  getCustomBranches(
    payload: GetCustomBranchesRequest,
  ): Promise<GetCustomBranchesResponse>;
}
