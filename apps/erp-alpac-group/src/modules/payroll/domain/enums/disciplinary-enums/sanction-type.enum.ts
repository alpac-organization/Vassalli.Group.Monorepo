import type { EnumType } from "@app/shared/types/enum.type";

/**
 * Tipos de sanción disciplinaria.
 *
 * @property VerbalWarning - Amonestación verbal (sin evidencias obligatorias).
 * @property Memorandum - Amonestación escrita.
 * @property Suspension - Suspensión sin goce (requiere fechas; rango 3–7 días).
 * @property CommitmentLetter - Carta de compromiso.
 * @property Termination - Terminación de contrato.
 */
export const SanctionTypeEnum = {
  VerbalWarning: { value: 1, label: "Amonestación verbal" },
  Memorandum: { value: 2, label: "Amonestación escrita" },
  Suspension: { value: 3, label: "Suspensión sin goce" },
  CommitmentLetter: { value: 4, label: "Carta de compromiso" },
  Termination: { value: 5, label: "Terminación de contrato" },
} as const satisfies Record<string, EnumType>;

export type SanctionTypeEnum = (typeof SanctionTypeEnum)[keyof typeof SanctionTypeEnum];

export type SanctionTypeEnumMap = keyof typeof SanctionTypeEnum;
