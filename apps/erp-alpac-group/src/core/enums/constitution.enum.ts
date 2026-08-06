import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum ConstitutionEnum
 * @description IDs de los enums de los tipos de constitución disponibles en el sistema.
 */
export const ConstitutionEnum = {  
  Natural: { value: 1, label: "Persona Natural", stringValue: "Natural" },
  Legal: { value: 2, label: "Persona Jurídica", stringValue: "Legal" },
} as const;

export type ConstitutionEnum =
  (typeof ConstitutionEnum)[keyof typeof ConstitutionEnum];

export const ConstitutionOptions: EnumType[] = Object.values(
  ConstitutionEnum,
).sort((a, b) => a.label.localeCompare(b.label));
