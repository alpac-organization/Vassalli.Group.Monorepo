import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CalculateLiquidationRequest extends BaseRequest {
  termination_id: string;
}
