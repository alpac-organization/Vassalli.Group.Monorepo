import type { EnumType } from "@app/shared/types/enum.type";

type PriorityLevelEnumType = EnumType & {
	textValue: string;
};

export const PriorityLevelEnum = {
	None: { value: 0, label: "Ninguna", textValue: "None" },
	Low: { value: 1, label: "Baja", textValue: "Low" },
	Normal: { value: 2, label: "Normal", textValue: "Normal" },
	High: { value: 3, label: "Alta", textValue: "High" },
	Critical: { value: 4, label: "Crítica", textValue: "Critical" },
} as const satisfies Record<string, PriorityLevelEnumType>;

export type PriorityLevelEnum =
	(typeof PriorityLevelEnum)[keyof typeof PriorityLevelEnum];

export const PriorityLevelOptions = Object.values(PriorityLevelEnum);

export type PriorityLevelType =
	(typeof PriorityLevelEnum)[keyof typeof PriorityLevelEnum]["textValue"];
