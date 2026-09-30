import type { IHttpHandler } from "@app/core/ports";
import type { IRackService } from "@app/modules/admin-warehouse/warehouse-managua/applications/interfaces/IRackService";
import type { RegisterRacksBulkRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/register-racks-bulk-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-racks-req";
import type { GetRackDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-rack-details-req";
import type { UpdateRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/update-rack-req";
import type { DeleteRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/delete-rack-req";
import type { GetRacksResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { GetRackDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-rack-details-res";
import { cleanParams } from "@app/shared/utils/object.utils";

export class RackService implements IRackService {
  private readonly apiHandler: IHttpHandler;

  constructor(apiHandler: IHttpHandler) {
    this.apiHandler = apiHandler;
  }

  async RegisterRacksBulk(payload: RegisterRacksBulkRequest): Promise<void> {
    const { company_id, module_code, warehouse_id, section_id, ...rest } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/racks`;
    await this.apiHandler.post<void>(url, rest);
  }

  async GetRacksBySection(payload: GetRacksRequest): Promise<GetRacksResponse> {
    const { company_id, module_code, warehouse_id, section_id, ...rest } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/racks`;
    return await this.apiHandler.get<GetRacksResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async GetRackDetails(
    payload: GetRackDetailsRequest,
  ): Promise<GetRackDetailsResponse> {
    const { company_id, module_code, warehouse_id, section_id, rack_id } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/racks/${rack_id}/details`;
    return await this.apiHandler.get<GetRackDetailsResponse>(url);
  }

  async UpdateRack(payload: UpdateRackRequest): Promise<void> {
    const { company_id, module_code, warehouse_id, section_id, rack_id, ...rest } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/racks/${rack_id}`;
    await this.apiHandler.patch<void>(url, rest);
  }

  async DeleteRack(payload: DeleteRackRequest): Promise<void> {
    const { company_id, module_code, warehouse_id, section_id, rack_id } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/racks/${rack_id}`;
    await this.apiHandler.delete<void>(url);
  }
}
