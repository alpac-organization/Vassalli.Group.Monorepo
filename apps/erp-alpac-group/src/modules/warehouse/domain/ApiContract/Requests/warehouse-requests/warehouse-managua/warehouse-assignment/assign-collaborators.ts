import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export type AssignmentCollaboratorRole =
  | "WarehouseAssistant"
  | "ForkliftOperator";

export interface AssignCollaboratorsBody {
  collaborators: string[];
  role?: AssignmentCollaboratorRole;
}

export interface AssignCollaboratorsRequest extends AssignCollaboratorsBody , BaseRequest {
  operational_order_id: string;
  assignment_id: string;
}
