import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PaginateBaseRequest } from "@app/shared/interfaces/paginate-base/paginate-base-request";

export interface GetPersonnelActionsRequest
  extends BaseRequest,
    Partial<PaginateBaseRequest> {
  status?: number | null;
  scope?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}
