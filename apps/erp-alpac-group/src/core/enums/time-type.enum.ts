import type { EnumType } from "@app/shared/types/enum.type";

/** Alineado a ERP.Core.Database.Domain.Enums.TimeType */
export const TimeTypeEnum = {
	Hours: { value: 1, label: "Horas", stringValue: "Hours" },
	Days: { value: 2, label: "Días", stringValue: "Days" },
	Weeks: { value: 3, label: "Semanas", stringValue: "Weeks" },
	Months: { value: 4, label: "Meses", stringValue: "Months" },
	Years: { value: 5, label: "Años", stringValue: "Years" },
} as const;

export type TimeTypeEnum = (typeof TimeTypeEnum)[keyof typeof TimeTypeEnum];

export const TimeTypeOptions: EnumType[] = Object.values(TimeTypeEnum);
