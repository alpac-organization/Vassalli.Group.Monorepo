import { cleanParams } from "@app/shared/utils/object.utils";
import type { IHttpHandler } from "@app/core/ports";
import type { ISupplyRequestServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/supply-requests/ISupplyRequestServices";
import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";

export class SupplyRequestServices implements ISupplyRequestServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async registerSupplyRequest(
    payload: RegisterSupplyRequest,
  ): Promise<void> {
    const { company_id, module_code, ...body } = payload;

    const url = `/companies/${company_id}/modules/${module_code}/inventory/supply-requests`;

    const requestBody = cleanParams({
      justification: body.justification,
      operational_order_id: body.operational_order_id,
      items: body.items.map((item) => ({
        product_stock_id: item.product_stock_id,
        amount: item.amount,
      })),
      reason_use: body.reason_use,
    });

    return this.httpHandler.post<void>(url, requestBody);
  }
}
