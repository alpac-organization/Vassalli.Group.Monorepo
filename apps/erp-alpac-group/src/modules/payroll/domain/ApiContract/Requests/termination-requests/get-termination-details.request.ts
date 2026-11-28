import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetTerminationDetailsRequest extends BaseRequest {
  termination_id: string;
}
