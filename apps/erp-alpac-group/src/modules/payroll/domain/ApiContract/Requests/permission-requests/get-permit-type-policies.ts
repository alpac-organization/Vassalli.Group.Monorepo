import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPermitTypePoliciesRequest extends BaseRequest {
  only_active?: boolean;
  permit_application_type?: number;
  page_number?: number;
  page_size?: number;
}
