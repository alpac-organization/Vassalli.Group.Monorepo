import type { IHttpHandler } from "@app/core/ports";
import type { IPermissionRequestServices } from "@app/modules/payroll/application/interfaces/permission-interfaces/IPermissionServices";
import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { PermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { PermissionListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";
import type { GeneratePermissionDocumentRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/generate-permission-docs-request";
import { cleanParams } from "@app/shared/utils/object.utils";

export class PermissionServices implements IPermissionRequestServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async createPermissionRequest(
    payload: CreatePermissionRequestBase,
  ): Promise<void> {
    try {
      const { company_id, module_code, ...body } = payload;
      const response = await this.apiHandler.post<void>(
        `companies/${company_id}/modules/${module_code}/permit-applications`,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getPermissions(
    payload: PermissionRequest,
  ): Promise<PermissionListResponse> {
    try {
      const { companie_id, module_code, ...queryParams } = payload;
      const params = cleanParams(queryParams);
      const response = await this.apiHandler.get<PermissionListResponse>(
        `/companies/${companie_id}/modules/${module_code}/permit-applications`,
        { params },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async cancelPermissionRequest(
    payload: CancelPermissionRequest,
  ): Promise<void> {
    try {
      const { company_id, module_code, permit_application_id } = payload;
      const response = await this.apiHandler.get<void>(
        `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/abort`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async generatePermissionDocument(
    payload: GeneratePermissionDocumentRequest,
  ): Promise<void> {
    try {
      const { company_id, module_code, permit_application_id } = payload;
      const response = await this.apiHandler.get<void>(
        `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/documents`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
