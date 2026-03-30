/**
 * @interface CatalogRequest
 * @description Estructura exacta que devuelve el backend para cada item de catálogo
 */
export interface CatalogRequest {
  /**
   * Identificador de la empresa
   */
  company_id: string;

  /**
   * Tipo de catálogo
   */
  catalog_type: string;
}
