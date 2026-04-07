import type { IHttpHandler } from "@app/core/ports";
import type { IPermissionRequestServices } from "@app/modules/vacations/application/interfaces/IPermissionServices";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { PermissionHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { PermissionHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/permission-history-response";
import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
import type { CancelPermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/cancel-permission-request";
import { cleanParams } from "@app/shared/utils/object.utils";
export class PermissionServices implements IPermissionRequestServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async createPermissionRequest(
    payload: CreatePermissionRequest,
  ): Promise<void> {
    const { company_id, module_code, identification_number, ...body } = payload;
    const response = await this.apiHandler.post<void>(
      `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/permit-applications`,
      body,
    );
    return response;
  }

  public async getVacationSaldo(
    payload: GetVacationSaldoRequest,
  ): Promise<GetVacationSaldoResponse> {
    const { company_id, module_code, identification_number } = payload;
    const response = await this.apiHandler.get<GetVacationSaldoResponse>(
      `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/vacations`,
    );
    return response;
  }
  public async getPermissionHistory(
    payload: PermissionHistoryRequest,
  ): Promise<PermissionHistoryResponse[]> {
    const { companie_id, module_code, identification_number, ...queryParams } =
      payload;
    const response = await this.apiHandler.get<PermissionHistoryResponse[]>(
      `/companies/${companie_id}/modules/${module_code}/collaborators/${identification_number}/permit-applications`,
      {
        params: cleanParams(queryParams),
      },
    );
    return response;
  }
  public async cancelPermissionRequest(
    payload: CancelPermissionRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      identification_number,
      permit_application_id,
    } = payload;
    const response = await this.apiHandler.get<void>(
      `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/permit-applications/${permit_application_id}/abort`,
    );
    return response;
  }
}
