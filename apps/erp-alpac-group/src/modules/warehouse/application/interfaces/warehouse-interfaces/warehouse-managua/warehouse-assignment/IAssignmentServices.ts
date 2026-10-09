import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
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
import type { AssignmentDetailsByCode } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details-by-code";
import type { AssignmentDetailsByCodeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-details-by-code";

export interface IWarehouseAssignmentServices {

  getAssignmentDetailsByCode(payload: AssignmentDetailsByCodeRequest): Promise<AssignmentDetailsByCode>;

  getAssignments(
    payload: GetAssignmentsRequest,
  ): Promise<GetAssignmentsResponse>;

  getAssignmentDetails(
    payload: GetAssignmentDetailsRequest,
  ): Promise<GetAssignmentDetailsResponse>;

  createAssignment(payload: CreateAssignmentRequest): Promise<void>;

  updateAssignment(payload: UpdateAssignmentRequest): Promise<void>;

  deleteAssignment(payload: DeleteAssignmentRequest): Promise<void>;

  assignCollaborators(payload: AssignCollaboratorsRequest): Promise<void>;

  assignMachinery(payload: AssignMachineryRequest): Promise<void>;

  deleteAssignmentCollaborator(
    payload: DeleteAssignmentCollaboratorRequest,
  ): Promise<void>;

  deleteAssignmentMachinery(
    payload: DeleteAssignmentMachineryRequest,
  ): Promise<void>;

  getAssignmentCollaborators(
    payload: GetAssignmentCollaboratorsRequest,
  ): Promise<GetAssignmentCollaboratorsResponse>;

  getAssignmentMachinery(
    payload: GetAssignmentMachineryRequest,
  ): Promise<GetAssignmentMachineryResponse>;

  assignPositions(
    payload: AssignPositionsRequest,
  ): Promise<AssignPositionsResponse>;

  getMachineryCatalog(
    payload: BaseRequest & { page_number?: number; page_size?: number },
  ): Promise<GetMachineryCatalogResponse>;

  sendToUnloading(payload: SendToUnloadingRequest): Promise<void>;
}
