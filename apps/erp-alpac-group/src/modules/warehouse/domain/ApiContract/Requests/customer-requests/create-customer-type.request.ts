import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateCustomerTypeRequest extends BaseRequest {
  code: string;
  name: string;
}
