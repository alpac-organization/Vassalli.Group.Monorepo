import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionCodeEnum: Record<string, EnumType> = {
  LOAN: {
    value: 1,
    label: "Préstamo",
  },
  // CHRISTMAS_BONUS_ADVANCE: {
  //    value: 2,
  //    label: "Adelanto de aguinaldo"
  // },
  LATE_ARRIVAL: {
    value: 3,
    label: "Llegadas tardes",
  },
  // SALARY_ADVANCE: {
  //    value: 4,
  //    label: "Adelanto de salario"
  // },
  SANCTION: {
    value: 5,
    label: "Sanción",
  },
  PURISIMA: {
    value: 6,
    label: "Purísima",
  },
  CHILD_SUPPORT_GARNISHMENT: {
    value: 8,
    label: "Embargo de pensión alimenticia",
  },
  JUDICIAL_GARNISHMENT: {
    value: 9,
    label: "Embargo judicial",
  },
  OTHER_DEDUCTION: {
    value: 7,
    label: "Otras deducciones",
  },
} as const;

export const DeductionOptions = Object.values(DeductionCodeEnum);

export type DeductionCodeEnum =
  (typeof DeductionCodeEnum)[keyof typeof DeductionCodeEnum];
