/**
 * @enum CatalogEnum
 * @description IDs de los catálogos disponibles en el sistema.
 * Cada valor corresponde al catalog_id que el backend usa para identificar
 * y devolver la lista de sub-catálogos correspondientes.
 */
export const CatalogEnum = {
  BANKS: "banks",
  WORK_AREAS: "work_areas",
  JOB_POSITIONS: "job_positions",
  BRANCHES: "branches",
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
