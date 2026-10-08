import type { AssignmentCollaboratorRole } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-collaborators";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface CollaboratorInformationDto {
  collaborator_name: string;
  work_area_name: string;
  job_position_name: string;
}

export interface AssignmentCollaboratorDto {
  assignment_collaborator_id: string;
  is_active: boolean;
  collaborator_id: string;
  created_by_user_name: string;
  assignment_operational_id: string;
  role: AssignmentCollaboratorRole;
  collaborator_information: CollaboratorInformationDto;
}

export interface GetAssignmentCollaboratorsResponse  extends PaginateBaseResponse<AssignmentCollaboratorDto[]> {
  data: AssignmentCollaboratorDto[];
}
