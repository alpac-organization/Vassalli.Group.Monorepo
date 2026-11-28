import type { EnumType } from "@app/shared/types/enum.type";

export const LiquidationStatusEnum = {
  Calculated: { value: 1, label: "Calculada" },
  Approved: { value: 2, label: "Aprobada" },
  Cancelled: { value: 3, label: "Cancelada" },
  Paid: { value: 4, label: "Pagada" },
} as const satisfies Record<string, EnumType>;

export type LiquidationStatusEnum =
  (typeof LiquidationStatusEnum)[keyof typeof LiquidationStatusEnum];

export type LiquidationStatusEnumMap = keyof typeof LiquidationStatusEnum;
