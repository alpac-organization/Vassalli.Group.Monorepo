import { TimeTypeEnum } from "@app/core/enums/time-type.enum";

export function formatTimeTypeLabel(type: string | null): string {
	if (!type?.trim()) return "—";

	const normalized = type.trim().toLowerCase();
	const match = Object.values(TimeTypeEnum).find((option) => {
		const value = option.stringValue.toLowerCase();
		return (
			value === normalized ||
			value.startsWith(normalized) ||
			normalized.startsWith(value.replace(/s$/, ""))
		);
	});

	return match?.label ?? type;
}
