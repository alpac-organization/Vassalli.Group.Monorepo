import type { IHttpHandler } from "@app/core/ports";
import type { ILiquidationServices } from "@app/modules/payroll/application/interfaces/liquidation-interfaces/ILiquidationServices";
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
import { cleanParams } from "@app/shared/utils/object.utils";

export class LiquidationServices implements ILiquidationServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async getLiquidations(payload: GetLiquidationsRequest): Promise<GetLiquidationsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations`;
    return this.httpHandler.get<GetLiquidationsResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async getLiquidationDetails(payload: LiquidationActionRequest): Promise<LiquidationDetailDto> {
    const { company_id, module_code, liquidation_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations/${liquidation_id}`;
    return this.httpHandler.get<LiquidationDetailDto>(url);
  }

  async calculateLiquidation(
    payload: CalculateLiquidationRequest,
  ): Promise<LiquidationDetailDto> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations`;
    return this.httpHandler.post<LiquidationDetailDto>(url, rest);
  }

  async approveLiquidation(payload: LiquidationActionRequest): Promise<void> {
    const { company_id, module_code, liquidation_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations/${liquidation_id}/approve`;
    await this.httpHandler.patch<void>(url, {});
  }

  async payLiquidation(payload: LiquidationActionRequest): Promise<void> {
    const { company_id, module_code, liquidation_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations/${liquidation_id}/pay`;
    await this.httpHandler.patch<void>(url, {});
  }

  async cancelLiquidation(payload: CancelLiquidationRequest): Promise<void> {
    const { company_id, module_code, liquidation_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/liquidations/${liquidation_id}/cancel`;
    await this.httpHandler.patch<void>(url, rest);
  }
}
