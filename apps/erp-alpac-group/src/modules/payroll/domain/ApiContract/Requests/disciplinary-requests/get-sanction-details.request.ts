import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSanctionDetailsRequest extends BaseRequest {
  sanction_id: string;
}
