/**
 * @enum CatalogEnum
 * @description IDs de los catálogos disponibles en el sistema.
 * Cada valor corresponde al catalog_id que el backend usa para identificar
 * y devolver la lista de sub-catálogos correspondientes.
 */
export const CatalogEnum = {
  BANKS: 1,
  WORK_AREA: 2,
  WORK_POSITION: 3,
  COLLABORATOR_STATUS: 4,
  BRANCH: 5,
} as const;

export type CatalogId = (typeof CatalogEnum)[keyof typeof CatalogEnum];
