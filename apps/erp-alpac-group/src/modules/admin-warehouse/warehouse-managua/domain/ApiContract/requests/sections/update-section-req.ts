import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateSectionRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  code?: string | null;
  width?: number | null;
  length?: number | null;
}
