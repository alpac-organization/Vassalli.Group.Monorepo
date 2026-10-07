import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AssignMachineryBody {
  machinery: string[];
  concept?: string;
}

export interface AssignMachineryRequest extends AssignMachineryBody, BaseRequest {
  operational_order_id: string;
  assignment_id: string;
}
