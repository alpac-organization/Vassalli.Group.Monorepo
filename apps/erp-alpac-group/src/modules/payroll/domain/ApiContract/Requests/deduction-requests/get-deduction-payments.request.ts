import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetDeductionPaymentsRequest extends BaseRequest {
  deduction_id: string;
  page_number?: number;
  page_size?: number;
}
