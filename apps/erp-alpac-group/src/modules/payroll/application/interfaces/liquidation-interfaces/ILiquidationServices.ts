import type { CalculateLiquidationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/calculate-liquidation.request";
import type { GetLiquidationsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/get-liquidations.request";
import type {
  CancelLiquidationRequest,
  LiquidationActionRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/liquidation-action.request";
import type {
  GetLiquidationsResponse,
  LiquidationDetailDto,
} from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";

export interface ILiquidationServices {
  getLiquidations(payload: GetLiquidationsRequest): Promise<GetLiquidationsResponse>;
  getLiquidationDetails(payload: LiquidationActionRequest): Promise<LiquidationDetailDto>;
  calculateLiquidation(payload: CalculateLiquidationRequest): Promise<LiquidationDetailDto>;
  approveLiquidation(payload: LiquidationActionRequest): Promise<void>;
  payLiquidation(payload: LiquidationActionRequest): Promise<void>;
  cancelLiquidation(payload: CancelLiquidationRequest): Promise<void>;
}
