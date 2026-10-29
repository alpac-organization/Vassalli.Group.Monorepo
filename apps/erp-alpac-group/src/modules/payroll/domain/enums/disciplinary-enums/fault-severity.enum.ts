import type { EnumType } from "@app/shared/types/enum.type";

export const FaultSeverityEnum = {
	Minor: { value: 1, label: "Leve" },
	Serious: { value: 2, label: "Grave" },
	VerySerious: { value: 3, label: "Muy grave" },
} as const satisfies Record<string, EnumType>;

export type FaultSeverityEnum = (typeof FaultSeverityEnum)[keyof typeof FaultSeverityEnum];

export const FaultSeverityOptions: EnumType[] = Object.values(FaultSeverityEnum);

export type FaultSeverityEnumMap = keyof typeof FaultSeverityEnum;
