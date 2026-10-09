import type { EnumType } from "@app/shared/types/enum.type";

export const TimeTypeEnum = {
	Days: { value: 1, label: "Días", stringValue: "Days" },
	Weeks: { value: 2, label: "Semanas", stringValue: "Weeks" },
	Months: { value: 3, label: "Meses", stringValue: "Months" },
	Years: { value: 4, label: "Años", stringValue: "Years" },
} as const;

export type TimeTypeEnum = (typeof TimeTypeEnum)[keyof typeof TimeTypeEnum];
export type TimeTypeValue = TimeTypeEnum["stringValue"];

export const TimeTypeOptions: EnumType[] = Object.values(TimeTypeEnum).map(
	(item) => ({
		value: item.stringValue,
		label: item.label,
	}),
);
