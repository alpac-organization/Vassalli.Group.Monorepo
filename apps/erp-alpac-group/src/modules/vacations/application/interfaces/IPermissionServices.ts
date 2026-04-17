import type { CreatePermissionRequestBase } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { GetVacationSaldoRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-saldo-request";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";
import type { PermissionHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { PermissionHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/permission-history-response";
import type { CancelPermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/cancel-permission-request";
import type { GeneratePermissionDocumentRequest } from "@app/modules/vacations/domain/ApiContract/Requests/generate-permission-docs-request";
export interface IPermissionRequestServices {
   /**
    * Crea una solicitud de permiso
    * @param payload - Datos de la solicitud de permiso
    * @returns void
    */
   createPermissionRequest(payload: CreatePermissionRequestBase): Promise<void>;
   /**
    * Obtiene el saldo de vacaciones
    * @param payload - Datos de la solicitud de saldo de vacaciones
    * @returns GetVacationSaldoResponse
    */
   getVacationSaldo(
      payload: GetVacationSaldoRequest,
   ): Promise<GetVacationSaldoResponse>;

   /**
    * Obtiene el historial de solicitudes de permisos
    * @param payload - Datos de la solicitud de historial de solicitudes de permisos
    * @returns PermissionHistoryResponse
    */
   getPermissionHistory(
      payload: PermissionHistoryRequest,
   ): Promise<PermissionHistoryResponse[]>;

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
