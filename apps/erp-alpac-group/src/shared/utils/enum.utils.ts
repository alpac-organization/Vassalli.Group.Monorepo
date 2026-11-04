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