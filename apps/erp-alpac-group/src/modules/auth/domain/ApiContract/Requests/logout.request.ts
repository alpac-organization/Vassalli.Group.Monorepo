/**
 * Representa la estructura de datos necesaria para invalidar la sesión de un usuario.
 * Se utiliza típicamente en la capa de Aplicación o Infraestructura para procesar el cierre de sesión.
 */
export interface LogoutRequest {
   /**
    * Identificador único de la compañía a la que pertenece el usuario.
    * @example 101
    */
   company_id: number;

   /**
    * El token de refresco (Refresh Token) que se desea invalidar en el servidor 
    * para evitar la generación de nuevos Access Tokens.
    * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    */
   refresh_token: string;
}