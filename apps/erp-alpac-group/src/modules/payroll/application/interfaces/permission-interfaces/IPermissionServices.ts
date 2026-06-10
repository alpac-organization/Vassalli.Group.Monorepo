import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { PermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { PermissionListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";
import type { GeneratePermissionDocumentRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/generate-permission-docs-request";
export interface IPermissionRequestServices {
  /**
   * Crea una solicitud de permiso
   * @param payload - Datos de la solicitud de permiso
   * @returns void
   */
  createPermissionRequest(payload: CreatePermissionRequestBase): Promise<void>;

  /**
   * Obtiene el historial de solicitudes de permisos
   * @param payload - Datos de la solicitud de historial de solicitudes de permisos
   * @returns PermissionHistoryResponse
   */
  getPermissions(payload: PermissionRequest): Promise<PermissionListResponse>;

  /**
   * Cancela una solicitud de permiso
   * @param payload - Datos de la solicitud de cancelación de permiso
   * @returns void
   */
  cancelPermissionRequest(payload: CancelPermissionRequest): Promise<void>;
  generatePermissionDocument(
    payload: GeneratePermissionDocumentRequest,
  ): Promise<void>;
}
