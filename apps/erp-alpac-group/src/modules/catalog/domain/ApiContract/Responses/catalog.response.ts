/**
 * @interface CatalogResponse
 * @description Estructura exacta que devuelve el backend para cada item de catálogo
 */
export interface CatalogResponse {
  sub_catalog_id: number;
  catalog_name: string;
  description: string;
  catalog_id: number;
}

/**
 * @interface CatalogListResponse
 * @description Estructura exacta que devuelve el backend para la lista de catálogos
 */
export interface CatalogListResponse {
  data: CatalogResponse[];
}
