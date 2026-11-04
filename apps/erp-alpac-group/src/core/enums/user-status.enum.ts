import type { EnumType } from "@app/shared/types/enum.type";

export const UserStatusEnum = {
   Active: { value: 1, label: "Activo" },
   Inactive: { value: 2, label: "Inactivo" },
   Locked: { value: 3, label: "Bloqueado" },
} as const satisfies Record<string, EnumType>;

export type UserStatusEnum = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];

export type UserStatusEnumMap = keyof typeof UserStatusEnum;