import type { EnumType } from "@app/shared/types/enum.type";

export const FaultStatusEnum: Record<string, EnumType> = {
  Open: { value: 1, label: "Pendiente de sanción" },
  SanctionApplied: { value: 2, label: "Sanción aplicada" },
  Prescribed: { value: 3, label: "Prescrita" },
} as const;

export type FaultStatusEnum =
  (typeof FaultStatusEnum)[keyof typeof FaultStatusEnum];
