import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum IdentificationEnum
 * @description IDs de los enums de los tipos de identificación disponibles en el sistema.
 */
export const MaritalStatus = {
  NONE: { value: 0, label: "No definido" },
  SINGLE: { value: 1, label: "Soltero" },
  MARRIED: { value: 2, label: "Casado" },
  DIVORCED: { value: 3, label: "Divorciado" },
  WIDOWED: { value: 4, label: "Viudo" },
  DOMESTIC_PARTNER: { value: 5, label: "Conyugue" },
  SEPARATED: { value: 6, label: "Separado" },
  OTHER: { value: 7, label: "Otro" },
} as const;

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

export const MaritalStatusOptions: EnumType[] = Object.values(
  MaritalStatus,
).sort((a, b) => a.label.localeCompare(b.label));
