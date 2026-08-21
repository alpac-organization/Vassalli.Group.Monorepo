/**
 * Contrato de servicios para la configuración de notificaciones push (FCM)
 * dentro del ecosistema ERP.
 * @interface INotificationConfigServices
 */
export interface INotificationConfigServices {
  /**
   * Registra el token FCM del dispositivo en el perfil del usuario
   * dentro de la empresa especificada.
   * @param {string} company_id - Identificador único de la empresa (Tenant ID).
   * @param {string} token - Token FCM del dispositivo.
   * @returns {Promise<void>} Promesa que resuelve cuando el token fue registrado.
   * @throws {Error} Si el servidor no responde o si el company_id no es válido.
   */
  RegisterPushToken(company_id: string, token: string): Promise<void>;

  /**
   * Desvincula el token FCM del dispositivo del perfil del usuario
   * dentro de la empresa especificada.
   * @param {string} company_id - Identificador único de la empresa (Tenant ID).
   * @param {string} token - Token FCM del dispositivo.
   * @returns {Promise<void>} Promesa que resuelve cuando el token fue desvinculado.
   * @throws {Error} Si el servidor no responde o si el company_id no es válido.
   */
  UnlinkPushToken(company_id: string, token: string): Promise<void>;
}