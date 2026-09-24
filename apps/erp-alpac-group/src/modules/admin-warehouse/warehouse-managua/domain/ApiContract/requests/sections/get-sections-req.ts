import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSectionsRequest extends BaseRequest {
   warehouse_id: string;
   section_code?: string | null;
   section_type?: number | null;
   section_storage_type?: number | null;
   is_active?: boolean | null;
   page_number?: number;
   page_size?: number;
}
