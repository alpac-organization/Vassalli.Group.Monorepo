import type { IHttpHandler } from "@app/core/ports";
import type { IMerchandiseServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/merchandise/IMerchandiseServices";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandisesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandises";
import type { CreateDucatRegistryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/create-ducat-registry";
import type { CreateDucatRegistryDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/create-ducat-registry-detail";
import type { AssignServiceOrderToCustomsDeclarationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/assign-service-order-to-customs-declaration";
import type { RegisterMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/register-merchandise";
import type { GetMerchandiseResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandisesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandises";
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

  public async createDucatRegistry(
    payload: CreateDucatRegistryRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/ducat-registry`;
    const response = await this.httpHandler.post<boolean>(url, {
      ...rest,
      general_observations:
        rest.general_observations?.trim() || undefined,
      container_number: rest.container_number.trim(),
      empresa: rest.empresa.trim(),
    });
    return response;
  }

  public async createDucatRegistryDetail(
    payload: CreateDucatRegistryDetailRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ducat_id, ...rest } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/ducats/${ducat_id}/detail`;
    const response = await this.httpHandler.post<boolean>(url, {
      ...rest,
      product_description: rest.product_description?.trim() || undefined,
      destination_area_observation:
        rest.destination_area_observation?.trim() || undefined,
      remitente: rest.remitente.trim(),
    });
    return response;
  }

  public async assignServiceOrderToCustomsDeclaration(
    payload: AssignServiceOrderToCustomsDeclarationRequest,
  ): Promise<boolean> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/customs-declaration/service-order`;
    const response = await this.httpHandler.post<boolean>(url, rest);
    return response;
  }

  public async getMerchandises(
    payload: GetMerchandisesRequest,
  ): Promise<GetMerchandisesResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/merchandises`;
    const response = await this.httpHandler.get<GetMerchandisesResponse>(url, {
      params: cleanParams(rest),
    });
    return response;
  }

  public async registerMerchandise(
    payload: RegisterMerchandiseRequest,
  ): Promise<string> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/merchandises`;
    const response = await this.httpHandler.post<string>(url, {
      ...rest,
      merchandise_name: rest.merchandise_name.trim(),
      description: rest.description?.trim() || undefined,
    });
    return response;
  }
}