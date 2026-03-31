export const RoleEnum = {
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervisor",
  OPERATOR: "Operator",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
