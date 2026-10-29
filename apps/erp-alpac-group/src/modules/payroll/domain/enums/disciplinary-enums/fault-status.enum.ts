import type { EnumType } from "@app/shared/types/enum.type";

export const FaultStatusEnum = {
	Open: { value: 1, label: "Pendiente de sanción" },
	SanctionApplied: { value: 2, label: "Sanción aplicada" },
	Prescribed: { value: 3, label: "Prescrita" },
} as const satisfies Record<string, EnumType>;

export type FaultStatusEnum = (typeof FaultStatusEnum)[keyof typeof FaultStatusEnum];

export type FaultStatusEnumMap = keyof typeof FaultStatusEnum;