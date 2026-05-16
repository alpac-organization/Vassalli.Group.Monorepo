import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum IdentificationEnum
 * @description IDs de los enums de los tipos de identificación disponibles en el sistema.
 */
export const IdentificationEnum = {
  NATIONAL_ID: { value: 1, label: "Cédula Nicaragüense" },
  PASSPORT: { value: 2, label: "Pasaporte" },
  RESIDENCE_ID: { value: 3, label: "Cédula de Residencia" },
} as const;

export type IdentificationEnum =
  (typeof IdentificationEnum)[keyof typeof IdentificationEnum];

export const IdentificationOptions: EnumType[] = Object.values(
  IdentificationEnum,
).sort((a, b) => a.label.localeCompare(b.label));
