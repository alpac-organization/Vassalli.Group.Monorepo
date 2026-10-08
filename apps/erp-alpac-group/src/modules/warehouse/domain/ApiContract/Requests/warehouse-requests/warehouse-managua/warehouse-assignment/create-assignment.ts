import type { DestinationType } from "./assignment-enums";
import type { AssignmentCollaboratorRole } from "./assign-collaborators";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AssignedMachineryPayload {
  concept?: string;
  machinery_id: string;
}

export interface AssignedCollaboratorPayload {
  collaborator_id: string;
  role: number | AssignmentCollaboratorRole;
}

export interface CreateAssignmentBody {
  warehouse_id?: string;
  observations?: string;
  merchandise?: string;
  merchandise_description?: string;
  destination_type?: DestinationType | number;
  has_assigned_machinery?: boolean;
  has_assigned_collaborators?: boolean;
  assigned_machineries?: AssignedMachineryPayload[];
  assigned_collaborators?: AssignedCollaboratorPayload[];
}

export interface CreateAssignmentRequest
  extends CreateAssignmentBody,
    BaseRequest {
  operational_order_id: string;
}
