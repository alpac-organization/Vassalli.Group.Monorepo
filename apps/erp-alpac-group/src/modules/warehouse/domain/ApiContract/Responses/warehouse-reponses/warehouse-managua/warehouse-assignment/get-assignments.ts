import type {
  DestinationType,
  AssignmentOperationalStatus,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface AssignmentOperationalDto {
  assignmentId: string;
  operationalOrderId: string;
  isAlerted: boolean;
  destinationType: DestinationType;
  status: AssignmentOperationalStatus;
  merchandise?: string;
  merchandiseDescription?: string;
  hasMachineryAssigned: boolean;
  hasCollaboratorsAssigned: boolean;
  createdAt: string;
}

export interface GetAssignmentsResponse extends PaginateBaseResponse<AssignmentOperationalDto[]> {
  data: AssignmentOperationalDto[];
}
