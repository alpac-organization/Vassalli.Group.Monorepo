import type { EnumType } from "@app/shared/types/enum.type";

export const WarehouseAssignmentStatusEnum = {
  Pending: { value: 1, label: "Pendiente" },
  Completed: { value: 2, label: "Completado" },
} as const;

export type WarehouseAssignmentStatusKey =
  keyof typeof WarehouseAssignmentStatusEnum;

export const WarehouseAssignmentStatusOptions: EnumType[] = Object.values(
  WarehouseAssignmentStatusEnum,
);
