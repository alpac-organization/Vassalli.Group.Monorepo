import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetAssignmentCollaboratorsRequest  extends BaseRequest{
  operational_order_id: string;
  assignment_id: string;
  page_number?: number;
  page_size?: number;
}
