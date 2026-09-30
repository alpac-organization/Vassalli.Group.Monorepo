import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { GetCustomBranchesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-custom-branches-request";
import type { GetCustomBranchesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
import type { GetWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-details-request";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";
import type { UpdateWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/update-warehouse-details-request";
import type { GetWarehouseCapacitiesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-capacities-response";
import type { GetWarehouseCapacitiesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-capacities-request";

export interface IWarehouseServices {

  GetWarehouses(payload: GetWarehouseRequest): Promise<GetWarehousesResponse>;

  CreateWarehouse(payload: CreateWarehouseRequest): Promise<void>;

  GetCustomBranches(payload: GetCustomBranchesRequest): Promise<GetCustomBranchesResponse>;

  GetWarehouseDetails(payload: GetWarehouseDetailsRequest): Promise<GetWarehouseDetailsResponse>;

  UpdateWarehouseDetails(payload: UpdateWarehouseDetailsRequest): Promise<void>;

  GetWarehouseCapacities(payload: GetWarehouseCapacitiesRequest): Promise<GetWarehouseCapacitiesResponse>;
}
