/**
 * @interface GetCompaniesResponse
 * @description Estructura de datos para el listado de unidades de negocio vinculadas al usuario.
 * Se utiliza principalmente en el selector de empresas tras el login o en paneles de administración.
 */
export interface GetCompaniesResponse {
    /** 
     * Identificador único de la entidad legal en la base de datos central.
     * @example 101
     */
    company_id: string;

    /** 
     * Razón social completa y oficial de la empresa.
     * @example "Alimentos y Procesos de América Central S.A."
     */
    company_name: string;

    /** 
     * Nombre corto o identificador interno para uso rápido en la interfaz y reportes.
     * @example "ALPAC-LOG"
     */
    alias: string;

    /** 
     * Ruta completa (URL) del isotipo o logotipo de la empresa.
     * @optional Si es nulo, la interfaz debe mostrar un placeholder con las iniciales del alias.
     */
    image_url?: string;
}