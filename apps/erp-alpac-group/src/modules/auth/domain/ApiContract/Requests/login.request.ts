/**
 * @interface LoginRequest
 * @description Define la estructura obligatoria para las solicitudes de inicio de sesión.
 * Este contrato asegura que los datos enviados al Backend cumplan con los requisitos del servicio de identidad.
 */
export interface LoginRequest {
    /** 
     * Identificador único del colaborador. 
     * Puede ser el correo corporativo o el nombre de usuario asignado por ALPAC.
     * @example "j.perez" o "admin_alpac"
     */
    username: string;

    /** 
     * Credencial de acceso secreta. 
     * Importante: El sistema de transporte (AxiosHttpAdapter) garantiza que este dato 
     * viaje cifrado mediante el protocolo HTTPS.
     */
    password: string;

    /** 
     * Identificador único de la entidad o empresa a la que el usuario intenta acceder.
     * Este ID permite al backend cargar el contexto, permisos y base de datos 
     * correspondiente a la organización seleccionada en el login.
     * @example 101
     * @required
     */
    company_id: number;
}