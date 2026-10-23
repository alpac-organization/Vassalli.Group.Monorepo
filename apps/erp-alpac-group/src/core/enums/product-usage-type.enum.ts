import type { EnumType } from "@app/shared/types/enum.type";

export const ProductUsageTypeEnum = {
	Insumo: {
		value: 1,
		label: "Administrativo",
		stringValue: "Administrative",
	},
	OperationalUse: {
		value: 2,
		label: "Operativo",
		stringValue: "Operational",
	},
} as const;

export type ProductUsageTypeEnum = (typeof ProductUsageTypeEnum)[keyof typeof ProductUsageTypeEnum];
export type ProductUsageType = ProductUsageTypeEnum["stringValue"];

export const ProductUsageTypeOptions: EnumType[] = Object.values(
	ProductUsageTypeEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));
