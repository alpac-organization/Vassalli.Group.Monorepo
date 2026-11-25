import type { EnumType } from "@app/shared/types/enum.type";

export function resolveEnumEntry<T extends EnumType>(
	enumMap: Record<string, T>,
	value: string | number | null | undefined,
): T | undefined {
	if (value === null || value === undefined) return undefined;

	if (typeof value === "string") {
		const byKey = enumMap[value];
		if (byKey) return byKey;

		const byStringValue = Object.values(enumMap).find(
			(item) => item.value === value,
		);
		if (byStringValue) return byStringValue;
	}

	const numericValue = typeof value === "number" ? value : Number(value);
	if (!Number.isNaN(numericValue)) {
		return Object.values(enumMap).find((item) => item.value === numericValue);
	}

	return undefined;
}

export function resolveEnumValue(
	value: string | number | null | undefined,
	byKey: Record<string, string>,
	byValue: Record<number, string>,
	fallback: string
): string {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	if (typeof value === "string" && byKey[value]) {
		return byKey[value];
	}

	const numericValue = typeof value === "number" ? value : Number(value);
	if (!Number.isNaN(numericValue) && byValue[numericValue]) {
		return byValue[numericValue];
	}

	return fallback;
}