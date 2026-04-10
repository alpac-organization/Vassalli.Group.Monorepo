import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum IdentificationEnum
 * @description IDs de los enums de los tipos de identificación disponibles en el sistema.
 */
export const MaritalStatus = {
  None: { value: 0, label: "No definido" },
  Single: { value: 1, label: "Soltero" },
  Married: { value: 2, label: "Casado" },
  Divorced: { value: 3, label: "Divorciado" },
  Widowed: { value: 4, label: "Viudo" },
  Domestic_Partner: { value: 5, label: "Conyugue" },
  Separated: { value: 6, label: "Separado" },
  Other: { value: 7, label: "Otro" },
} as const;

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

export const MaritalStatusOptions: EnumType[] = Object.values(
  MaritalStatus,
).sort((a, b) => a.label.localeCompare(b.label));
