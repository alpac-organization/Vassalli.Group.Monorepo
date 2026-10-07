import type { EnumType } from "@app/shared/types/enum.type";

export const SupplierPriceHistoryTypeEnum = {
	UnitPrice: {
		value: 1,
		label: "Precio unitario",
		stringValue: "UnitPrice",
	},
	PreferentialPrice: {
		value: 2,
		label: "Precio preferencial",
		stringValue: "PreferentialPrice",
	},
} as const;

export type SupplierPriceHistoryTypeEnum =
	(typeof SupplierPriceHistoryTypeEnum)[keyof typeof SupplierPriceHistoryTypeEnum];
export type SupplierPriceHistoryType =
	SupplierPriceHistoryTypeEnum["stringValue"];

export const SupplierPriceHistoryTypeOptions: EnumType[] = Object.values(
	SupplierPriceHistoryTypeEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));
