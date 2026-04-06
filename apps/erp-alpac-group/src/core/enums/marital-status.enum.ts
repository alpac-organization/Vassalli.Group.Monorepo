import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum MaritalStatusEnum
 * @description IDs de los estados civiles disponibles en el sistema.
 */
export const MaritalStatusEnum = {
  SINGLE: { value: 1, label: "Soltero" },
  MARRIED: { value: 2, label: "Casado" },
  DIVORCED: { value: 3, label: "Divorciado" },
  WIDOWED: { value: 4, label: "Viudo" },
  FREE_UNION: { value: 5, label: "Unión libre" },
} as const;

export type MaritalStatusEnum =
  (typeof MaritalStatusEnum)[keyof typeof MaritalStatusEnum];

export const MaritalStatusOptions: EnumType[] =
  Object.values(MaritalStatusEnum);
