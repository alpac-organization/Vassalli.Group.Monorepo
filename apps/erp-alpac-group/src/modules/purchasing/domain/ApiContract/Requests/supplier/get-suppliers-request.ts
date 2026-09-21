import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSuppliersRequest extends BaseRequest {
  commercial_name?: string;
  identification_number?: string;
  constitution_type?: number | string;
  page_number?: number;
  page_size?: number;
}
