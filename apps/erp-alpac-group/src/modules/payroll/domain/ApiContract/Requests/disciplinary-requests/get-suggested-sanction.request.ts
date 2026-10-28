import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSuggestedSanctionRequest extends BaseRequest {
  fault_id: string;
}
