import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DestinationType } from "./assignment-enums";

export interface UpdateAssignmentBody {
  observations?: string;
  merchandise?: string;
  merchandiseDescription?: string;
  warehouseId?: string;
  destinationType?: DestinationType | number;
}

export interface UpdateAssignmentRequest extends UpdateAssignmentBody, BaseRequest {
  operational_order_id: string;
  assignment_id: string;
}
