import type { IHttpHandler } from "@app/core/ports";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { IWarehouseServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/IWarehousesServices";

export class WarehouseServices implements IWarehouseServices {
  private readonly apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  async GetWarehouses(
    payload: GetWarehouseRequest,
  ): Promise<GetWarehousesResponse[]> {
    try {
      const { company_id, module_code, ...rest } = payload;

      const url = `companies/${company_id}/modules/${module_code}/warehouse`;

      return await this.apiHandler.get<any>(url, { params: cleanParams(rest) });
    } catch (error) {
      throw error;
    }
  }

  async CreateWarehouse(payload: CreateWarehouseRequest): Promise<void> {
    try {
      const { company_id, module_code, ...rest } = payload;

      const url = `companies/${company_id}/modules/${module_code}/warehouse`;

      await this.apiHandler.post<void>(url, rest);
    } catch (error) {
      throw error;
    }
  }
}
