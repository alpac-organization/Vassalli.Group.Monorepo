import type { EnumType } from "@app/shared/types/enum.type";

export type ProductStatus = "Active" | "Inactive";

export interface ProductStatusValues {
	value: number;
	stringValue: string;
	label: string;
}

export const ProductStatus: Record<ProductStatus, ProductStatusValues> = {
	Active: {
		value: 1,
		label: "Activo",
		stringValue: "Active",
	},
	Inactive: {
		value: 2,
		label: "Inactivo",
		stringValue: "Inactive",
	},
} as const;

export const ProductStatusOptions: EnumType[] = Object.values(ProductStatus).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));