import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PaginateBaseRequest } from "@app/shared/interfaces/paginate-base/paginate-base-request";

export interface GetDeductionPaymentsRequest
  extends BaseRequest,
    Partial<PaginateBaseRequest> {
  deduction_id: string;
}
