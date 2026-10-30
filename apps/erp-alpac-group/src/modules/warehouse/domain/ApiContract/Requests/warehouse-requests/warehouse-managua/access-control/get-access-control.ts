import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetAccessControlRequest extends BaseRequest {
  only_day?: boolean;
  date?: string;
  plate_number?: string;
  document_number?: string;
  container_number?: string;
  contaniner_number?: string;
  reception_code?: string;
  code?: string;
  document_type?: number;
  page_number?: number;
  page_size?: number;
}
