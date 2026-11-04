import type { EnumType } from "@app/shared/types/enum.type";

export const SanctionStatusEnum = {
	Applied: { value: 1, label: "Aplicada" },
	Cancelled: { value: 2, label: "Cancelada" },
} as const satisfies Record<string, EnumType>;

export type SanctionStatusEnum = (typeof SanctionStatusEnum)[keyof typeof SanctionStatusEnum];

export type SanctionStatusEnumMap = keyof typeof SanctionStatusEnum;

