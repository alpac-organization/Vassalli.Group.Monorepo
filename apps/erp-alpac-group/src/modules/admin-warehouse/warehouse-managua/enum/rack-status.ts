import type { EnumType } from "@app/shared/types/enum.type";
import type { RackEnumType } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";

export const RackStatusEnum = {
  Available: { value: 1, label: "Disponible", textValue: "Available" },
  Occupied: { value: 2, label: "Ocupado", textValue: "Occupied" },
  UnderMaintenance: {
    value: 3,
    label: "En mantenimiento",
    textValue: "UnderMaintenance",
  },
  Blocked: { value: 4, label: "Bloqueado", textValue: "Blocked" },
} as const satisfies Record<string, RackEnumType>;

export type RackStatusEnum =
  (typeof RackStatusEnum)[keyof typeof RackStatusEnum];

export const RackStatusOptions: EnumType[] = Object.values(RackStatusEnum);

export type RackStatusValue =
  (typeof RackStatusEnum)[keyof typeof RackStatusEnum]["textValue"];
