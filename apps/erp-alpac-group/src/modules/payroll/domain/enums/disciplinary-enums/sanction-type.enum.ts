import type { EnumType } from "@app/shared/types/enum.type";

export const SanctionTypeEnum: Record<string, EnumType> = {
  VerbalWarning: { value: 1, label: "Amonestación verbal" },
  Memorandum: { value: 2, label: "Amonestación escrita" },
  Suspension: { value: 3, label: "Suspensión sin goce" },
  CommitmentLetter: { value: 4, label: "Carta de compromiso" },
  Termination: { value: 5, label: "Terminación de contrato" },
} as const;

export type SanctionTypeEnum =
  (typeof SanctionTypeEnum)[keyof typeof SanctionTypeEnum];
