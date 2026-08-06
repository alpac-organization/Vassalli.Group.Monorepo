import type { IHttpHandler } from "@app/core/ports";
import type { IAccessControl } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/access-control/IAccessControl";
import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetReceptionEntranceDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control-detail";
import type { GetVehiclesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-vehicles";
import type { UpdateReceptionEntranceRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { GetReceptionEntrancesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { GetVehiclesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-vehicles";
import type { AddDucatsToReceptionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/add-ducats-to-reception";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { GenerateExitAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/generate-exit";

export class AccessControlServices implements IAccessControl {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async getAccessControl(
    payload: GetAccessControlRequest,
  ): Promise<GetReceptionEntrancesResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/reception-entrances`;
    return this.httpHandler.get<GetReceptionEntrancesResponse>(url, {
      params: cleanParams(rest),
    });
  }
  public async getAccessControlById(
    payload: GetReceptionEntranceDetailRequest,
  ): Promise<ReceptionEntranceDetail> {
    const { company_id, module_code, reception_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}`;
    return this.httpHandler.get<ReceptionEntranceDetail>(url);
  }

  public async createAccessControl(
    payload: CreateAccessControlRequest,
  ): Promise<void> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/reception-entrances`;
    return this.httpHandler.post<void>(url, rest);
  }
  public async updateAccessControl(
    payload: UpdateReceptionEntranceRequest,
  ): Promise<void> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}`;
    return this.httpHandler.patch<void>(url, cleanParams(rest));
  }

  public async addDucatsToReception(
    payload: AddDucatsToReceptionRequest,
  ): Promise<void> {
    const { company_id, module_code, reception_id, ducat_numbers } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/ducats`;
    return this.httpHandler.post<void>(url, { ducat_numbers });
  }

  public async getVehicles(
    payload: GetVehiclesRequest,
  ): Promise<GetVehiclesResponse> {
    const { company_id, module_code } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/transport-units`;
    const response = await this.httpHandler.get<GetVehiclesResponse>(url);
    return response;
  }

  public async generateExitAccessControl(
    payload: GenerateExitAccessControlRequest,
  ): Promise<void> {
    const { company_id, module_code, reception_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/receptions/${reception_id}/exit`;
    return this.httpHandler.post<void>(url, cleanParams(rest));
  }
}
