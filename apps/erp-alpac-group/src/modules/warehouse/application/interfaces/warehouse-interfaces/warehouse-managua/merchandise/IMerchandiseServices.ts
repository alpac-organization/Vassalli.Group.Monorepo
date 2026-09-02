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
import type { CreateShippingCompanyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/create-shipping-company";
import type { GetShippingCompanyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-shipping-company";
import type { GetShippingCompanyResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-shipping-company";

export interface IMerchandiseServices {
  getMerchandise(
    payload: GetMerchandiseRequest,
  ): Promise<GetMerchandiseResponse>;
  getMerchandiseById(
    payload: GetMerchandiseDetailRequest,
  ): Promise<GetMerchandiseDetailResponse>;
  createDucatRegistry(
    payload: CreateDucatRegistryRequest,
  ): Promise<boolean>;
  createDucatRegistryDetail(
    payload: CreateDucatRegistryDetailRequest,
  ): Promise<boolean>;
  assignServiceOrderToCustomsDeclaration(
    payload: AssignServiceOrderToCustomsDeclarationRequest,
  ): Promise<boolean>;
  getMerchandises(payload: GetMerchandisesRequest): Promise<GetMerchandisesResponse>;
  registerMerchandise(payload: RegisterMerchandiseRequest): Promise<string>;
  createShippingCompany(payload: CreateShippingCompanyRequest): Promise<boolean>;
  getShippingCompany(payload: GetShippingCompanyRequest): Promise<GetShippingCompanyResponse>;
}