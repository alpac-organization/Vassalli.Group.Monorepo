import { cleanParams } from "@app/shared/utils/object.utils";
import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryStocksServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/inventory-stocks/IInventoryStocksServices";
import type { GetInventoryStocksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/inventory-stocks/get-inventory-stocks.request";
import type { GetInventoryStocksResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";

export class InventoryStocksServices implements IInventoryStocksServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getInventoryStocks(
    payload: GetInventoryStocksRequest,
  ): Promise<GetInventoryStocksResponse> {
    const { company_id, module_code, ...queryParams } = payload;

    const url = `/companies/${company_id}/modules/${module_code}/inventory-stock`;
    const params = cleanParams(queryParams);

    return this.httpHandler.get<GetInventoryStocksResponse>(url, { params });
  }
}
