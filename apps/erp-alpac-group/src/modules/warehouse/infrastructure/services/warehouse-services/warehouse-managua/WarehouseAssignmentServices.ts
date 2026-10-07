import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseAssignmentServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/warehouse-assignment/IWarehouseAssignmentServices";

import type { CreateAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-assignment";
import type { GetAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments";
import type { GetAssignmentDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-details";
import type { UpdateAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/update-assignment";
import type { DeleteAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment";

import type { AssignCollaboratorsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-collaborators";
import type { AssignMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-machinery";
import type { DeleteAssignmentCollaboratorRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment-collaborator";
import type { DeleteAssignmentMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment-machinery";
import type { GetAssignmentCollaboratorsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import type { GetAssignmentMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-machinery";

import type { GetAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details";
import type { GetAssignmentCollaboratorsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import type { GetAssignmentMachineryResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-machinery";
import { cleanParams } from "@app/shared/utils/object.utils";

export class WarehouseAssignmentServices
  implements IWarehouseAssignmentServices
{
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  // ─── CRUD Asignaciones Operativas ─────────────────────────────────────────

  public async getAssignments(
    payload: GetAssignmentsRequest,
  ): Promise<GetAssignmentsResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      ...queryParams
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments`;
    return this.httpHandler.get<GetAssignmentsResponse>(url, {
      params: cleanParams(queryParams),
    });
  }

  public async getAssignmentDetails(
    payload: GetAssignmentDetailsRequest,
  ): Promise<GetAssignmentDetailsResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/details`;
    return this.httpHandler.get<GetAssignmentDetailsResponse>(url);
  }

  public async createAssignment(
    payload: CreateAssignmentRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments`;
    return this.httpHandler.post<void>(url, body);
  }

  public async updateAssignment(
    payload: UpdateAssignmentRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}`;
    return this.httpHandler.patch<void>(url, body);
  }

  public async deleteAssignment(
    payload: DeleteAssignmentRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}`;
    return this.httpHandler.delete<void>(url);
  }

  // ─── Sub-recursos: Colaboradores y Maquinaria ───────────────────────────────

  public async assignCollaborators(
    payload: AssignCollaboratorsRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/collaborators`;
    return this.httpHandler.post<void>(url, body);
  }

  public async assignMachinery(
    payload: AssignMachineryRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/machinery`;
    return this.httpHandler.post<void>(url, body);
  }

  public async deleteAssignmentCollaborator(
    payload: DeleteAssignmentCollaboratorRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      assignment_collaborator_id,
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/collaborators/${assignment_collaborator_id}`;
    return this.httpHandler.delete<void>(url);
  }

  public async deleteAssignmentMachinery(
    payload: DeleteAssignmentMachineryRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      assignment_machinery_id,
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/machinery/${assignment_machinery_id}`;
    return this.httpHandler.delete<void>(url);
  }

  public async getAssignmentCollaborators(
    payload: GetAssignmentCollaboratorsRequest,
  ): Promise<GetAssignmentCollaboratorsResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...queryParams
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/collaborators`;
    return this.httpHandler.get<GetAssignmentCollaboratorsResponse>(url, {
      params: cleanParams(queryParams),
    });
  }

  public async getAssignmentMachinery(
    payload: GetAssignmentMachineryRequest,
  ): Promise<GetAssignmentMachineryResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...queryParams
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/machinery`;
    return this.httpHandler.get<GetAssignmentMachineryResponse>(url, {
      params: cleanParams(queryParams),
    });
  }
}
