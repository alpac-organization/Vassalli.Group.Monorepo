import { cleanParams } from "@app/shared/utils/object.utils";
import type { IHttpHandler } from "@app/core/ports";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { IWarehouseAssignmentServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/warehouse-assignment/IAssignmentServices";

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
import type { AssignPositionsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-positions";
import type { SendToUnloadingRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/send-to-unloading";

import type { GetAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details";
import type { GetAssignmentCollaboratorsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import type { GetAssignmentMachineryResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-machinery";
import type { AssignPositionsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/assign-positions";
import type { GetMachineryCatalogResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalog";
import type { AssignmentDetailsByCodeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-details-by-code";
import type { AssignmentDetailsByCode } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details-by-code";

export class WarehouseAssignmentServices
  implements IWarehouseAssignmentServices
{
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }
  
  public async getAssignmentDetailsByCode(payload: AssignmentDetailsByCodeRequest): Promise<AssignmentDetailsByCode>{
    try {
      const { assignment_code, company_id, module_code } = payload;

      console.log(JSON.stringify(payload, null, 3))

      return this.httpHandler.get<AssignmentDetailsByCode>(`/companies/${company_id}/modules/${module_code}/assignments/code?assignment_code=${assignment_code}`);
    }
    catch(error){
      throw error;
    }
  }

  public async getAssignments(
    payload: GetAssignmentsRequest,
  ): Promise<GetAssignmentsResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      ...queryParams
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/assignments`;
    const params = cleanParams({
      ...queryParams,
      operational_order_id,
    });
    return this.httpHandler.get<GetAssignmentsResponse>(url, {
      params,
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

    const requestBody = {
      warehouse_id: body.warehouse_id,
      observations: body.observations,
      merchandise: body.merchandise,
      merchandise_description: body.merchandise_description,
      destination_type: body.destination_type,
      has_assigned_machinery: body.has_assigned_machinery ?? false,
      has_assigned_collaborators: body.has_assigned_collaborators ?? false,
      assigned_machineries: (body.assigned_machineries ?? []).map((m) => ({
        concept: m.concept,
        machinery_id: m.machinery_id,
      })),
      assigned_collaborators: (body.assigned_collaborators ?? []).map((c) => ({
        collaborator_id: c.collaborator_id,
        role: c.role,
      })),
    };

    return this.httpHandler.post<void>(url, cleanParams(requestBody));
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

    const requestBody = {
      observations: body.observations,
      merchandise: body.merchandise,
      merchandise_description: body.merchandise_description,
      warehouse_id: body.warehouse_id,
      destination_type: body.destination_type,
    };

    return this.httpHandler.patch<void>(url, cleanParams(requestBody));
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

  public async assignPositions(
    payload: AssignPositionsRequest,
  ): Promise<AssignPositionsResponse> {
    const {
      company_id,
      module_code,
      operational_order_id,
      assignment_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/assignment-positions`;
    return this.httpHandler.post<AssignPositionsResponse>(url, body);
  }

  public async getMachineryCatalog(
    payload: BaseRequest & { page_number?: number; page_size?: number },
  ): Promise<GetMachineryCatalogResponse> {
    const { company_id, module_code, page_number = 1, page_size = 20 } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/machinery`;
    return this.httpHandler.get<GetMachineryCatalogResponse>(url, {
      params: { page_number, page_size },
    });
  }

  public async sendToUnloading(
    payload: SendToUnloadingRequest,
  ): Promise<void> {
    const { company_id, module_code, operational_order_id, assignment_id } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/assignments/${assignment_id}/send-to-unloading`;
    return this.httpHandler.post<void>(url, {});
  }
}
