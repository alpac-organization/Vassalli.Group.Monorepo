import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetLotsRequest extends BaseRequest {
  section_id: string;
  code?: string;
  status?: number;
  page_number?: number;
  page_size?: number;
}
