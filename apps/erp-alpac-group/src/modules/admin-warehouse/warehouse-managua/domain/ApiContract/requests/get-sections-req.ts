import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSectionsRequest extends BaseRequest {
  warehouse_id: string;
  section_code?: string;
  section_type?: number;
  section_storage_type?: number;
  is_active?: boolean;
  page_number?: number;
  page_size?: number;
}
