import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSectionDetailsRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
}
