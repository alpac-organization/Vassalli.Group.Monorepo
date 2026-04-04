/**
 * @enum CatalogEnum
 * @description IDs de los catálogos disponibles en el sistema.
 * Cada valor corresponde al catalog_id que el backend usa para identificar
 * y devolver la lista de sub-catálogos correspondientes.
 */
export const CatalogEnum = {
  BRANCHES: 1,
  WORK_AREAS: 2,
  JOB_POSITIONS: 3,
  BANKS: 5,
  EXCHANGE_RATES: 6,
} as const;

export type CatalogEnum = (typeof CatalogEnum)[keyof typeof CatalogEnum];
