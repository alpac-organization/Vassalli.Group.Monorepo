import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPositionDetailRequest extends BaseRequest {
  position_id: string;
}

