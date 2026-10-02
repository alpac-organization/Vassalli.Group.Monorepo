import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetCustomBranchesRequest extends BaseRequest {
  page_number?: number;
  page_size?: number;
  search?: string;
}