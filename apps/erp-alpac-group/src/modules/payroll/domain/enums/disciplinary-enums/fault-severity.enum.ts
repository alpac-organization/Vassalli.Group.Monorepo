import type { EnumType } from "@app/shared/types/enum.type";

export const FaultSeverityEnum: Record<string, EnumType> = {
  Minor: { value: 1, label: "Leve" },
  Serious: { value: 2, label: "Grave" },
  VerySerious: { value: 3, label: "Muy grave" },
} as const;

export type FaultSeverityEnum =
  (typeof FaultSeverityEnum)[keyof typeof FaultSeverityEnum];
