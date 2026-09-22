import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterSectionRequest extends BaseRequest {
  warehouse_id: string;
  code: string;
  section_type: number;
  section_storage_type: number;
  width: number;
  length: number;
}
