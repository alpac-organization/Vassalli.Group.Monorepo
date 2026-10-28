import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetFaultDetailsRequest extends BaseRequest {
  fault_id: string;
}
