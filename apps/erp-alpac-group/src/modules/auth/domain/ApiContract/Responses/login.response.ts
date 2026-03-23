/**
 * @interface LoginResponse
 * @description Representa la estructura de éxito tras una autenticación válida.
 * Contiene las credenciales de sesión y el contexto inicial de la empresa para el usuario.
 */
export interface LoginResponse {
    /** 
     * Identificador único interno del usuario (UUID).
     * @example "550e8400-e29b-41d4-a716-446655440000"
     */
    user_id: string;

    /** 
     * Nombre completo o alias de visualización del colaborador.
     */
    user_name: string;

    /** 
     * Token de acceso (JWT) necesario para autorizar peticiones al Backend.
     * Debe enviarse en el header 'Authorization: Bearer <token>'.
     */
    access_token: string;

    /** 
     * Token secundario para renovar la sesión sin solicitar credenciales nuevamente.
     * Tiene una vigencia mayor que el access_token.
     */
    refresh_token: string;

    /** 
     * Información de la entidad legal a la que el usuario ha ingresado.
     * Fundamental para la segmentación multiempresa de ALPAC.
     */
    company_information: CompanyInformation;
}

/**
 * @interface CompanyInformation
 * @description Datos básicos de identidad corporativa para la personalización de la interfaz.
 */
export interface CompanyInformation {
    /** 
     * ID numérico de la empresa en la base de datos centralizada.
     */
    company_id:   number;

    /** 
     * URL absoluta del logotipo de la empresa para mostrar en el Header o reportes.
     * @optional Puede ser nulo si la empresa no tiene una imagen configurada.
     */
    image_url?:   string;

    /** 
     * Razón social o nombre comercial de la unidad de negocio.
     * @example "ALPAC Logística S.A."
     */
    company_name: string;
}