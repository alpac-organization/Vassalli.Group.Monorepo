import type { EnumType } from "@app/shared/types/enum.type";

export const SupplierTypeEnum = {
	International: {
		value: 1,
		label: "Internacional",
		stringValue: "International",
	},
	Ordinary: {
		value: 2,
		label: "Ordinario",
		stringValue: "Ordinary",
	},
	Exclusive: {
		value: 3,
		label: "Exclusivo",
		stringValue: "Exclusive",
	},
} as const;

export type SupplierTypeEnum =
	(typeof SupplierTypeEnum)[keyof typeof SupplierTypeEnum];
export type SupplierType = SupplierTypeEnum["stringValue"];

export const SupplierTypeOptions: EnumType[] = Object.values(
	SupplierTypeEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));

export const resolveSupplierType = (
	raw?: string | number | null,
): SupplierType | undefined => {
	if (raw == null || raw === "") return undefined;

	const asString = String(raw);
	const byString = Object.values(SupplierTypeEnum).find(
		(item) => item.stringValue === asString,
	);
	if (byString) return byString.stringValue;

	const asNumber = Number(raw);
	if (!Number.isNaN(asNumber)) {
		const byValue = Object.values(SupplierTypeEnum).find(
			(item) => item.value === asNumber,
		);
		if (byValue) return byValue.stringValue;
	}

	return undefined;
};

export const resolveSupplierTypeLabel = (
	raw?: string | number | null,
): string => {
	const resolved = resolveSupplierType(raw);
	if (!resolved) return "—";
	const found = Object.values(SupplierTypeEnum).find(
		(item) => item.stringValue === resolved,
	);
	return found?.label ?? resolved;
};
