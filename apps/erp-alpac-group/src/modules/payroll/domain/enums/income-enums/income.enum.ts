export const IncomeTypeEnum = {
   INCOME_OVERTIME: "OVERTIME",
   INCOME_COMMISSION: "COMMISSION",
   INCOME_BONUS: "BONUS",
   INCOME_DEPRECIATION: "DEPRECIATION" // agregar al colaborador
} as const;

export type IncomeTypeEnum = (typeof IncomeTypeEnum)[keyof typeof IncomeTypeEnum];