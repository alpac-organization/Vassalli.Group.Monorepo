import type { EnumType } from "@app/shared/types/enum.type";

export const ProductUsageTypeEnum = {
	Insumo: {
		value: 1,
		label: "Insumo",
		stringValue: "Insumo",
	},
	OperationalUse: {
		value: 2,
		label: "Uso operativo",
		stringValue: "OperationalUse",
	},
} as const;

export type ProductUsageTypeEnum =
	(typeof ProductUsageTypeEnum)[keyof typeof ProductUsageTypeEnum];
export type ProductUsageType = ProductUsageTypeEnum["stringValue"];

export const ProductUsageTypeOptions: EnumType[] = Object.values(
	ProductUsageTypeEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));
