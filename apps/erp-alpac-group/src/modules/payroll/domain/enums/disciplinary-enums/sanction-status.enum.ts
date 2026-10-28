import type { EnumType } from "@app/shared/types/enum.type";

export const SanctionStatusEnum: Record<string, EnumType> = {
  Applied: { value: 1, label: "Aplicada" },
  Cancelled: { value: 2, label: "Cancelada" },
} as const;

export type SanctionStatusEnum =
  (typeof SanctionStatusEnum)[keyof typeof SanctionStatusEnum];
