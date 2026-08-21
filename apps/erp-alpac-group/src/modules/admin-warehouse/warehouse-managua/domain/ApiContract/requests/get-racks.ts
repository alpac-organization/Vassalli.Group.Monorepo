import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetRacksRequest extends BaseRequest {
  section_id: string;
  level_number?: number | null;
  status?: string | null;
  usage_profile?: string | null;
  width_metres?: number | null;
  length_metres?: number | null;
  height_metres?: number | null;
}
