import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseAllocationServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/warehouse-allocation/IWarehouseAllocationServices";
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
import { cleanParams } from "@app/shared/utils/object.utils";

export class WarehouseAllocationServices implements IWarehouseAllocationServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getPendingAssignments(
    payload: GetPendingAssignmentsRequest,
  ): Promise<GetPendingAssignmentsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments/pending`;
    const response = await this.httpHandler.get<GetPendingAssignmentsResponse>(
      url,
      { params: cleanParams(rest) },
    );
    return response;
  }

  public async getWarehouseAssignments(
    payload: GetWarehouseAssignmentsRequest,
  ): Promise<GetWarehouseAssignmentsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments`;
    const response = await this.httpHandler.get<GetWarehouseAssignmentsResponse>(
      url,
      { params: cleanParams(rest) },
    );
    return response;
  }

  public async getWarehouseAssignmentDetail(
    payload: GetWarehouseAssignmentDetailRequest,
  ): Promise<GetWarehouseAssignmentDetailResponse> {
    const { company_id, module_code, reception_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments/${reception_id}`;
    const response = await this.httpHandler.get<GetWarehouseAssignmentDetailResponse>(
      url,
    );
    return response;
  }

  public async getAvailableWarehouses(
    payload: GetAvailableWarehousesRequest,
  ): Promise<GetAvailableWarehousesResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments/available-warehouses`;
    const response = await this.httpHandler.get<GetAvailableWarehousesResponse>(
      url,
      { params: cleanParams(rest) },
    );
    return response;
  }

  public async getWarehouseMachineries(
    payload: GetWarehouseMachineriesRequest,
  ): Promise<GetWarehouseMachineriesResponse> {
    const { company_id, module_code } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-machineries`;
    const response = await this.httpHandler.get<GetWarehouseMachineriesResponse>(
      url,
    );
    return response;
  }

  public async getWarehouseStaffs(
    payload: GetWarehouseStaffsRequest,
  ): Promise<GetWarehouseStaffsResponse> {
    const { company_id, module_code } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-staffs`;
    const response = await this.httpHandler.get<GetWarehouseStaffsResponse>(url);
    return response;
  }

  public async createWarehouseAssignment(
    payload: CreateWarehouseAssignmentRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/warehouse-assignment`;
    return this.httpHandler.post<boolean>(url, cleanParams(rest));
  }

  public async createUnloadingDetails(
    payload: CreateUnloadingDetailsRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/unloading-details`;
    return this.httpHandler.post<boolean>(url, cleanParams(rest));
  }

  public async createUnloadingCrew(
    payload: CreateUnloadingCrewRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/unloading-crew`;
    return this.httpHandler.post<boolean>(url, cleanParams(rest));
  }

  public async createUnloadingMachinery(
    payload: CreateUnloadingMachineryRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/unloading-machinery`;
    return this.httpHandler.post<boolean>(url, cleanParams(rest));
  }

  public async completeWarehouseAssignment(
    payload: CompleteWarehouseAssignmentRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/complete-assignment`;
    return this.httpHandler.post<boolean>(url);
  }
}