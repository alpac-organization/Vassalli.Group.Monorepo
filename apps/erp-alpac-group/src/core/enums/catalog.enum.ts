/**
 * @enum CatalogEnum
 * @description IDs de los catálogos disponibles en el sistema.
 * Cada valor corresponde al catalog_id que el backend usa para identificar
 * y devolver la lista de sub-catálogos correspondientes.
 */
export const CatalogEnum = {
  BANKS: "Banks",
  WORK_AREAS: "WorkAreas",
  JOB_POSITIONS: "JobPositions",
  COLLABORATOR_STATUS: "CollaboratorStatus",
  BRANCHES: "Branches",
} as const;

export type CatalogId = (typeof CatalogEnum)[keyof typeof CatalogEnum];
