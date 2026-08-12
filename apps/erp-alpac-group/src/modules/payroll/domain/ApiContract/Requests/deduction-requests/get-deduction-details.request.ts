import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetDeductionDetailsRequest extends BaseRequest {
  deduction_id: string;
  identification_number?: string;
}
