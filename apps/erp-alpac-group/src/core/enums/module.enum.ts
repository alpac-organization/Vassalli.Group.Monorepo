export const ModuleEnum = {
  PAYROLL: "NMI-43GW",
  WORK_MANAGEMENT: "GES-M86T",
} as const;

export type ModuleEnum = (typeof ModuleEnum)[keyof typeof ModuleEnum];
