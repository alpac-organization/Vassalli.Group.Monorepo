export const ModuleEnum = {
   PAYROLL: "NMI-43GW",
   WORK_MANAGEMENT: "GES-M86T",
   APPLICATIONS: "SOL-6NF2",
   STORAGE: "ALM-2KE4",
} as const;

export type ModuleEnum = (typeof ModuleEnum)[keyof typeof ModuleEnum];
