import type { EnumType } from "@app/shared/types/enum.type";

export type ProductStatus = "Active" | "Inactive" | "LowProcess";

export interface ProductStatusValues {
	value: 		 number;
	stringValue: string;
	label: 		 string;
	colorBadge:  string;
}

export const ProductStatus: Record<ProductStatus, ProductStatusValues> = {
	Active: {
		value: 		 1,
		label: 		 "Activo",
		stringValue: "Active",
		colorBadge:  "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
	},
	Inactive: {
		value: 		 2,
		label: 		 "Inactivo",
		stringValue: "Inactive",
		colorBadge:  "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
	},
	LowProcess: {
		value:       3,
		label:       "En proceso de baja",
		stringValue: "LowProcess",
		colorBadge:  "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
	},
} as const;

export const ProductStatusOptions: EnumType[] = Object.values(ProductStatus).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));