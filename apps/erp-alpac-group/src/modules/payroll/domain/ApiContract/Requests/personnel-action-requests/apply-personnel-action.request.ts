import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ApplyPersonnelActionRequest extends BaseRequest {
  request_id: string;
}
