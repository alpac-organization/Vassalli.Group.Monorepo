import type { EnumType } from "@app/shared/types/enum.type";

/**
 * Matches backend `TimeType` (JsonStringEnumConverter): Day | Month | Year.
 * Labels stay plural Spanish for UI; payload values must be singular.
 */
export const TimeTypeEnum = {
	Day: { value: 1, label: "Días", stringValue: "Day" },
	Month: { value: 2, label: "Meses", stringValue: "Month" },
	Year: { value: 3, label: "Años", stringValue: "Year" },
} as const;

export type TimeTypeEnum = (typeof TimeTypeEnum)[keyof typeof TimeTypeEnum];
export type TimeTypeValue = TimeTypeEnum["stringValue"];

export const TimeTypeOptions: EnumType[] = Object.values(TimeTypeEnum).map(
	(item) => ({
		value: item.stringValue,
		label: item.label,
	}),
);

/** Legacy plural / alternate strings → canonical API value. */
const TIME_TYPE_ALIASES: Record<string, TimeTypeValue> = {
	day: "Day",
	days: "Day",
	month: "Month",
	months: "Month",
	year: "Year",
	years: "Year",
};

export function normalizeTimeTypeToApiValue(
	raw: unknown,
): TimeTypeValue | undefined {
	if (raw == null || raw === "") return undefined;

	if (typeof raw === "number") {
		return Object.values(TimeTypeEnum).find((option) => option.value === raw)
			?.stringValue;
	}

	if (typeof raw === "string") {
		const trimmed = raw.trim();
		const byExact = Object.values(TimeTypeEnum).find(
			(option) =>
				option.stringValue === trimmed ||
				option.stringValue.toLowerCase() === trimmed.toLowerCase(),
		);
		if (byExact) return byExact.stringValue;

		const alias = TIME_TYPE_ALIASES[trimmed.toLowerCase()];
		if (alias) return alias;

		const asNumber = Number(trimmed);
		if (!Number.isNaN(asNumber)) {
			return Object.values(TimeTypeEnum).find(
				(option) => option.value === asNumber,
			)?.stringValue;
		}
	}

	return undefined;
}
