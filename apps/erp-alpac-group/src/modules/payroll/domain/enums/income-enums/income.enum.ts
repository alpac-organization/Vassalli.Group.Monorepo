export const IncomeTypeEnum = {
   INCOME_OVERTIME: "OVERTIME",
   INCOME_COMMISSION: "COMMISSION",
   INCOME_BONUS: "BONUS",
   INCOME_DEPRECIATION: "DEPRECIATION"
} as const;

export type IncomeTypeEnum = (typeof IncomeTypeEnum)[keyof typeof IncomeTypeEnum];