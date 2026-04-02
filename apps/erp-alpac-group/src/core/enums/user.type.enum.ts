export const UserTypeEnum = {
  STANDARD_USER: "StandardUser",
  EMPLOYEE_SELF_SERVICE: "EmployeeSelfService",
} as const;

export type UserTypeEnum = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];
