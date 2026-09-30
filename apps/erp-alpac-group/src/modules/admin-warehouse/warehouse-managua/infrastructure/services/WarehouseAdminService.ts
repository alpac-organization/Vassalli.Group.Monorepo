import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseAdminService } from "@app/modules/admin-warehouse/warehouse-managua/applications/interfaces/IWarehouseAdminService";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

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
  async GetLots(payload: GetLotsRequest): Promise<GetLotsResponse> {
    const { company_id, module_code, warehouse_id, section_id, ...rest } =
      payload;
    const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots`;
    return await this.apiHandler.get<GetLotsResponse>(url, {
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
  async RegisterLot(payload: RegisterLotRequest): Promise<void> {
    const { company_id, module_code, warehouse_id, section_id, ...rest } =
      payload;

    const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots`;

    await this.apiHandler.post<void>(url, rest);
  }
}
