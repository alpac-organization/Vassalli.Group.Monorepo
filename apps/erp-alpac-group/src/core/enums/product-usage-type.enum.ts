export type ProductUsageTypeEnum = 'Administrative' | 'Operational'

export interface ProductUsageTypeValues {
	value: number;
	label: string;
	stringValue: string;	
}

export const ProductUsageType : Record<ProductUsageTypeEnum, ProductUsageTypeValues> = {
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
}