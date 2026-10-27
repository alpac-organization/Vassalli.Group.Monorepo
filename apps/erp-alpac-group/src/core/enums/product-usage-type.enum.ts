import type { EnumType } from "@app/shared/types/enum.type";

export type ProductUsageType = "Administrative" | "Operational"

export interface ProductUsageTypeValues {
	value: number;
	stringValue: string;
	label: string;
}

export const ProductUsageType : Record<ProductUsageType,ProductUsageTypeValues> = {
	Administrative: {
		value: 1,
		label: "Administrativo",
		stringValue: "Administrative",
	},
	Operational: {
		value: 2,
		label: "Operativo",
		stringValue: "Operational",
	},
} as const;

export const ProductUsageTypeOptions: EnumType[] = Object.values(ProductUsageType).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));
