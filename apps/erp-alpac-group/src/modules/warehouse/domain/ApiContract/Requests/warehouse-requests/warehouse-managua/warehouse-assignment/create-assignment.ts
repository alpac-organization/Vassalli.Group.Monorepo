import type { DestinationType } from "./assignment-enums";
import type { AssignmentCollaboratorRole } from "./assign-collaborators";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AssignedMachineryPayload {
  concept?: string;
  machineryId: string;
}

export interface AssignedCollaboratorPayload {
  collaboratorId: string;
  role: number | AssignmentCollaboratorRole;
}

export interface CreateAssignmentBody {
  warehouseId?: string;
  observations?: string;
  merchandise?: string;
  merchandiseDescription?: string;
  destinationType?: DestinationType | number;
  hasAssignedMachinery?: boolean;
  hasAssignedCollaborators?: boolean;
  assignedMachineries?: AssignedMachineryPayload[];
  assignedCollaborators?: AssignedCollaboratorPayload[];
}

export interface CreateAssignmentRequest extends CreateAssignmentBody , BaseRequest {
  operational_order_id: string;
}
