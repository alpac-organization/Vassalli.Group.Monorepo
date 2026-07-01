export const ModuleEnum = {
  PAYROLL: "NMI-43GW",
  WORK_MANAGEMENT: "GES-M86T",
  APPLICATIONS: "SOL-6NF2",
  WAREHOUSE_MANAGUA: "ALM-MAN-2KE4",
  WAREHOUSE_CORINTO: "ALM-COR-2KE4",
  ADMINISTRATION: "ADM-1IF2",
  PUBLIC: "PUBLIC",
} as const;

export type ModuleEnum = (typeof ModuleEnum)[keyof typeof ModuleEnum];
