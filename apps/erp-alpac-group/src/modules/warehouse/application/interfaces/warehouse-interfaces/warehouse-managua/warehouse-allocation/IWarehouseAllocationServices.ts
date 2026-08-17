import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { GetWarehouseAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import type { GetWarehouseAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-assignment-detail";
import type { GetAvailableWarehousesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { GetWarehouseMachineriesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-staffs";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-warehouse-assignment";
import type { CreateUnloadingDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-details";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-machinery";
import type { CompleteWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/complete-warehouse-assignment";
import type { GetPendingAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { GetWarehouseAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import type { GetWarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignment-detail";
import type { GetAvailableWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { GetWarehouseMachineriesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-staffs";

export interface IWarehouseAllocationServices {
  getPendingAssignments(
    payload: GetPendingAssignmentsRequest,
  ): Promise<GetPendingAssignmentsResponse>;
  getWarehouseAssignments(
    payload: GetWarehouseAssignmentsRequest,
  ): Promise<GetWarehouseAssignmentsResponse>;
  getWarehouseAssignmentDetail(
    payload: GetWarehouseAssignmentDetailRequest,
  ): Promise<GetWarehouseAssignmentDetailResponse>;
  getAvailableWarehouses(
    payload: GetAvailableWarehousesRequest,
  ): Promise<GetAvailableWarehousesResponse>;
  getWarehouseMachineries(
    payload: GetWarehouseMachineriesRequest,
  ): Promise<GetWarehouseMachineriesResponse>;
  getWarehouseStaffs(
    payload: GetWarehouseStaffsRequest,
  ): Promise<GetWarehouseStaffsResponse>;
  createWarehouseAssignment(
    payload: CreateWarehouseAssignmentRequest,
  ): Promise<boolean>;
  createUnloadingDetails(
    payload: CreateUnloadingDetailsRequest,
  ): Promise<boolean>;
  createUnloadingCrew(payload: CreateUnloadingCrewRequest): Promise<boolean>;
  createUnloadingMachinery(
    payload: CreateUnloadingMachineryRequest,
  ): Promise<boolean>;
  completeWarehouseAssignment(
    payload: CompleteWarehouseAssignmentRequest,
  ): Promise<boolean>;
}