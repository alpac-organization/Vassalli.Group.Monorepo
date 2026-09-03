import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseAssignmentServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/warehouse-assignment/IWarehouseAssignmentServices";
import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-warehouse-assignment";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-machinery";
import type { CompleteAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/complete-assignment";
import type { GetAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetAssignmentsHistoryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments-history";
import type { GetPendingAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { WarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetMachineryCatalogsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalogs";
import { cleanParams } from "@app/shared/utils/object.utils";

export class WarehouseAssignmentServices implements IWarehouseAssignmentServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getPendingAssignments(
    payload: GetPendingAssignmentsRequest,
  ): Promise<GetPendingAssignmentsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments/pending`;
    return this.httpHandler.get<GetPendingAssignmentsResponse>(url, {
      params: cleanParams(rest),
    });
  }

  public async createWarehouseAssignment(
    payload: CreateWarehouseAssignmentRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/warehouse-assignment`;
    return this.httpHandler.post<boolean>(url, rest);
  }

  public async createUnloadingCrew(
    payload: CreateUnloadingCrewRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/unloading-crew`;
    return this.httpHandler.post<boolean>(url, rest);
  }

  public async createUnloadingMachinery(
    payload: CreateUnloadingMachineryRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/unloading-machinery`;
    return this.httpHandler.post<boolean>(url, rest);
  }

  public async completeAssignment(
    payload: CompleteAssignmentRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/complete-assignment`;
    return this.httpHandler.post<boolean>(url, rest);
  }

  public async getAssignmentDetail(
    payload: GetAssignmentDetailRequest,
  ): Promise<WarehouseAssignmentDetailResponse> {
    const { company_id, module_code, reception_id, entrance_ducat_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments/${reception_id}`;
    return this.httpHandler.get<WarehouseAssignmentDetailResponse>(url, {
      // cleanParams excluye undefined automáticamente — si es CustomsDeclaration no se envía el param
      params: cleanParams({ entrance_ducat_id }),
    });
  }

  public async getAssignmentsHistory(
    payload: GetAssignmentsHistoryRequest,
  ): Promise<GetPendingAssignmentsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouse-assignments`;
    return this.httpHandler.get<GetPendingAssignmentsResponse>(url, {
      params: cleanParams(rest),
    });
  }

  public async getMachineryCatalogs(payload: {
    company_id: string;
    module_code: string;
  }): Promise<GetMachineryCatalogsResponse> {
    const { company_id, module_code } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/machinery-catalogs`;
    return this.httpHandler.get<GetMachineryCatalogsResponse>(url);
  }
}

