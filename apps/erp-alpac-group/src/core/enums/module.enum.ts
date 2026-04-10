//no se toca , esta correcto el enum
export const ModuleEnum = {
   PAYROLL: "NMI-43GW",
   WORK_MANAGEMENT: "GES-M86T",
   APPLICATIONS: "SOL-6NF2",
   PUBLIC: "PUBLIC",
} as const;

export type ModuleEnum = (typeof ModuleEnum)[keyof typeof ModuleEnum];
