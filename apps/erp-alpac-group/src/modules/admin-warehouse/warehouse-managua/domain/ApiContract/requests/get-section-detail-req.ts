import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSectionDetailRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
}
