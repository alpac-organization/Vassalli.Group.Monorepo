import type { EnumType } from "@app/shared/types/enum.type";

export const TerminationStatusEnum = {
  Pending: { value: 1, label: "En proceso" },
  Closed: { value: 2, label: "Aprobada" },
  Cancelled: { value: 3, label: "Cancelada" },
} as const satisfies Record<string, EnumType>;

export type TerminationStatusEnum =
  (typeof TerminationStatusEnum)[keyof typeof TerminationStatusEnum];

export type TerminationStatusEnumMap = keyof typeof TerminationStatusEnum;
