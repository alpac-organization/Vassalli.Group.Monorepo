import type {
  DestinationType,
  AssignmentOperationalStatus,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface AssignmentOperationalDto {
  assignment_id: string;
  operational_order_id: string;
  is_alerted: boolean;
  destination_type: DestinationType | number;
  status: AssignmentOperationalStatus | number;
  merchandise?: string;
  merchandise_description?: string;
  has_machinery_assigned: boolean;
  has_collaborators_assigned: boolean;
  created_at: string;
}

export interface GetAssignmentsResponse
  extends PaginateBaseResponse<AssignmentOperationalDto[]> {
  data: AssignmentOperationalDto[];
}
