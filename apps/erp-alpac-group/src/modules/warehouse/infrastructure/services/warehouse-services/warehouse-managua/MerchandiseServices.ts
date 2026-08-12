import type { IHttpHandler } from "@app/core/ports";
import type { IMerchandiseServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/merchandise/IMerchandiseServices";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandiseResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import { cleanParams } from "@app/shared/utils/object.utils";

export class MerchandiseServices implements IMerchandiseServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getMerchandise(
    payload: GetMerchandiseRequest,
  ): Promise<GetMerchandiseResponse> {
    const { company_id, module_code, document_type, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/merchandise-registry`;
    const response = await this.httpHandler.get<GetMerchandiseResponse>(url, {
      params: cleanParams({
        ...rest,
        document_type:
          typeof document_type === "object" && document_type !== null
            ? document_type.value
            : document_type,
      }),
    });
    return response;
  }
  public async getMerchandiseById(
    payload: GetMerchandiseDetailRequest,
  ): Promise<GetMerchandiseDetailResponse> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/merchandise-registry/${reception_id}`;
    const response = await this.httpHandler.get<GetMerchandiseDetailResponse>(
      url,
      {
        params: cleanParams(rest),
      },
    );
    return response;
  }
}
