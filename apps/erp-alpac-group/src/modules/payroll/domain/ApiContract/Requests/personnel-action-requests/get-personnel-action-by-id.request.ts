import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPersonnelActionByIdRequest extends BaseRequest {
  request_id: string;
}
