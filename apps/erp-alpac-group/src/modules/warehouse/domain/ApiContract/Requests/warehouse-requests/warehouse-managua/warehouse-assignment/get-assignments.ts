import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { AssignmentOperationalStatus } from "./assignment-enums";

export interface GetAssignmentsQueryParams {
  page_number?: number;
  page_size?: number;
  status?: AssignmentOperationalStatus | number;
  operational_order_id?: string;
}

export interface GetAssignmentsRequest extends GetAssignmentsQueryParams, BaseRequest {
  operational_order_id: string;
}
