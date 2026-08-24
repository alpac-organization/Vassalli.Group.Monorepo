import type { RegisterPushTokenRequest } from "../../domain/ApiContract/Requests/register-push-token.request";
import type { UnlinkPushTokenRequest } from "../../domain/ApiContract/Requests/unlink-push-token.request";

/**
 * Contrato de servicios para la configuración de notificaciones push (FCM)
 * dentro del ecosistema ERP.
 * @interface INotificationConfigServices
 */
export interface INotificationConfigServices {
  /**
   * Registra el token FCM del dispositivo en el perfil del usuario
   * dentro de la empresa especificada.
   * @param {RegisterPushTokenRequest} payload - payload para registrar el token FCM.
   * @returns {Promise<void>} Promesa que resuelve cuando el token fue registrado.
   * @throws {Error} Si el servidor no responde o si el company_id no es válido.
   */
  RegisterPushToken(payload: RegisterPushTokenRequest): Promise<void>;

  /**
   * Desvincula el token FCM del dispositivo del perfil del usuario
   * dentro de la empresa especificada.
   * @param {UnlinkPushTokenRequest} payload - payload para desvincular el token FCM.
   * @returns {Promise<void>} Promesa que resuelve cuando el token fue desvinculado.
   * @throws {Error} Si el servidor no responde o si el company_id no es válido.
   */
  UnlinkPushToken(payload: UnlinkPushTokenRequest): Promise<void>;
}