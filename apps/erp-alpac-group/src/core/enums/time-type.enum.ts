import type { EnumType } from "@app/shared/types/enum.type";

export const TimeTypeEnum = {
	Hours: { value: 1, label: "Días", stringValue: "Day" },
	Days: { value: 2, label: "Meses", stringValue: "Month" },
	Weeks: { value: 3, label: "Años", stringValue: "Yea" }	
} as const;

export type TimeTypeEnum = (typeof TimeTypeEnum)[keyof typeof TimeTypeEnum];

export const TimeTypeOptions: EnumType[] = Object.values(TimeTypeEnum);
