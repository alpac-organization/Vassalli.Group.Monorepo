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
  BRANCHES: "Branches",
} as const;

export type CatalogEnum = (typeof CatalogEnum)[keyof typeof CatalogEnum];

export const CollaboratorStatusEnum = {
  ACTIVE: "Activo",
  VACATION: "Vacaciones",
  SUBSIDY: "Subsidio",
  MATERNITY: "Maternidad",
  SUSPENDED: "Suspendido",
  LIQUIDATED: "Liquidado",
  RESIGNED: "Renunciado",
  RETIRED: "Jubilado",
  DISMISSED: "Despedido",
  DECEASED: "Fallecido",
} as const;

export type CollaboratorStatusEnum =
  (typeof CollaboratorStatusEnum)[keyof typeof CollaboratorStatusEnum];
