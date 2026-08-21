import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseAdminService } from "@app/modules/admin-warehouse/warehouse-managua/applications/interfaces/IWarehouseAdmin";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { RegisterLotsResultResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { GetRackResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRackDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-rack-detail";
import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";
import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
import type { CreateRackResultResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/create-rack-result";

export class WarehouseAdminServices implements IWarehouseAdminService {
  private readonly apiHandler: IHttpHandler;
  constructor(apiHandler: IHttpHandler) {
    this.apiHandler = apiHandler;
  }

  async GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse> {
    const { company_id, module_code, warehouse_id, ...rest } = payload;
    const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}/sections`;
    return await this.apiHandler.get<GetSectionsResponse>(url, {
      params: cleanParams(rest),
    });
  }
  async CreateSection(payload: CreateSectionRequest): Promise<void> {
    const { company_id, module_code, warehouse_id, ...rest } = payload;
    const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}/sections`;
    await this.apiHandler.post<void>(url, rest);
  }
  async GetLots(payload: GetLotsRequest): Promise<LotListItemResponse[]> {
    const { company_id, module_code, section_id, ...rest } = payload;
    const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots`;
    return await this.apiHandler.get<LotListItemResponse[]>(url, {
      params: cleanParams(rest),
    });
  }
  async GetLotsById(payload: GetLotDetailRequest): Promise<LotDetailResponse> {
    const { company_id, module_code, section_id, lot_id, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots/${lot_id}`;

    return await this.apiHandler.get<LotDetailResponse>(url, {
      params: cleanParams(rest),
    });
  }
  async CreateLots(
    payload: CreateLotsRequest,
  ): Promise<RegisterLotsResultResponse> {
    const { company_id, module_code, section_id, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots`;

    return await this.apiHandler.post<RegisterLotsResultResponse>(url, rest);
  }

  async GetRacks(payload: GetRacksRequest): Promise<GetRackResponse> {
    const { company_id, module_code, section_id, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/racks`;

    return await this.apiHandler.get<GetRackResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async GetRackById(
    payload: GetRackDetailRequest,
  ): Promise<GetRackDetailResponse> {
    const { company_id, module_code, rack_id, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/racks/${rack_id}`;

    return await this.apiHandler.get<GetRackDetailResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async CreateRacks(
    payload: CreateRacksRequest,
  ): Promise<CreateRackResultResponse> {
    const { company_id, module_code, section_id, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/racks`;

    return await this.apiHandler.post<CreateRackResultResponse>(url, rest);
  }
}
