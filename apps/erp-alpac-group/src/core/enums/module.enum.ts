export const ModuleEnum = {
  PAYROLL: "NMI-43GW",
  WORK_MANAGEMENT: "GES-M86T",
  WAREHOUSE_MANAGUA: "ALM-MAN-2KE4",
  WAREHOUSE_CORINTO: "ALM-COR-2KE4",
  WAREHOUSE_ADMIN: "ADM-ALM-495W",
  ADMINISTRATION: "ADM-1IF2",
  PURCHASING: "COM-129U",
  FINANCE: "FIN-567W",
  MANAGEMENT: "GRC-873Y",
  PUBLIC: "PUBLIC",
} as const;

export type ModuleEnum = (typeof ModuleEnum)[keyof typeof ModuleEnum];
