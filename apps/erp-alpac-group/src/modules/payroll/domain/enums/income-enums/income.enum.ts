export const IncomeTypeEnum = {
   INCOME_OVERTIME: "OVERTIME",
} as const;

export type IncomeTypeEnum = (typeof IncomeTypeEnum)[keyof typeof IncomeTypeEnum];