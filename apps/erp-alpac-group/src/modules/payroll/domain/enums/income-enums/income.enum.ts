export const IncomeTypeEnum = {
   INCOME_OVERTIME: "OVERTIME",
   INCOME_COMMISSION: "COMMISSION",
} as const;

export type IncomeTypeEnum = (typeof IncomeTypeEnum)[keyof typeof IncomeTypeEnum];