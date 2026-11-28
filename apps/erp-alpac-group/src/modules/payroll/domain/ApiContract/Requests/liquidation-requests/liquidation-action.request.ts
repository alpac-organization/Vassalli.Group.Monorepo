import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface LiquidationActionRequest extends BaseRequest {
  liquidation_id: string;
}

export interface CancelLiquidationRequest extends LiquidationActionRequest {
  cancellation_reason: string;
}
