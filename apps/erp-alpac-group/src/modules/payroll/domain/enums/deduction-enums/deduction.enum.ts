import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionCodeEnum: Record<string, EnumType> = {
   ANNUAL_BONUS_ADVANCE: {
      value: "ANNUAL_BONUS_ADVANCE",
      label: "Adelanto de aguinaldo"
   },
   SALARY_ADVANCE: {
      value: "SALARY_ADVANCE",
      label: "Adelanto de salario"
   },
   JUDICIAL_GARNISHMENT: {
      value: "JUDICIAL_GARNISHMENT",
      label: "Embargo judicial"
   },
   CHILD_SUPPORT_GARNISHMENT: {
      value: "CHILD_SUPPORT_GARNISHMENT",
      label: "Embargo de pensión alimenticia"
   },
   LATE_ARRIVALS: {
      value: "LATE_ARRIVALS",
      label: "Llegadas tardes"
   },
   LOAN_REPAYMENT: {
      value: "LOAN_REPAYMENT",
      label: "Préstamo"
   },
   PURISIMA_CONTRIBUTION: {
      value: "PURISIMA_CONTRIBUTION",
      label: "Purísima"
   },
   DISCIPLINARY_FINE: {
      value: "DISCIPLINARY_FINE",
      label: "Sanción"
   }
} as const;

export const DeductionOptions = Object.values(DeductionCodeEnum);

export type DeductionCodeEnum = (typeof DeductionCodeEnum)[keyof typeof DeductionCodeEnum];