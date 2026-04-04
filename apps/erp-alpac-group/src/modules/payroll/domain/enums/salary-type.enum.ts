import type { EnumType } from '@app/shared/types/enum.type';

export const SalaryTypeEnum = {
  FIXED: { value: 1, label: 'Fijo' },
  VARIABLE: { value: 2, label: 'Variable' },
  PROFESSIONAL_SERVICES: { value: 3, label: 'Servicios Profesionales' },
} as const;

export type SalaryTypeEnum =
  (typeof SalaryTypeEnum)[keyof typeof SalaryTypeEnum];

export const SalaryTypeOptions: EnumType[] = Object.values(SalaryTypeEnum);
