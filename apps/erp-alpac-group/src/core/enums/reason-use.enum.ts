import type { EnumType } from "@app/shared/types/enum.type";

export type ReasonUse = "Sale" | "Operation";

export const ReasonUse: Record<ReasonUse, EnumType> = {
  Sale: {
    value: 1,
    label: "Venta",
  },
  Operation: {
    value: 2,
    label: "Operativo",
  },
} as const;
