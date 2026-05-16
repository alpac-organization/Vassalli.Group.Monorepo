//no se toca , esta correcto el enum
export const RoleEnum = {
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervisor",
  MANAGER: "Manager",
  OPERATOR: "Operator",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
