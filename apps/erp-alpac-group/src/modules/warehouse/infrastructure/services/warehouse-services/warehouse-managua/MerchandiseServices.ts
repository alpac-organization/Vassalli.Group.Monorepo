import type { IHttpHandler } from "@app/core/ports";
import type { IMerchandiseServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/merchandise/IMerchandiseServices";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import { cleanParams } from "@app/shared/utils/object.utils";

export class MerchandiseServices implements IMerchandiseServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getMerchandise(
    payload: GetMerchandiseRequest,
  ): Promise<GetMerchandiseResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/merchandise-registry`;
    const response = await this.httpHandler.get<GetMerchandiseResponse>(url, {
      params: cleanParams(rest),
    });
    return response;
  }
}
