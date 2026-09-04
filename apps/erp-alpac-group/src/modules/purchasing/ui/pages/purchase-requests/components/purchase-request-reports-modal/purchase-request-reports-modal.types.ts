import type { EnumType } from "@app/shared/types/enum.type";

export const PurchaseRequestReportType = {
	ConsolidatedProducts: "consolidated_products",
	TotalProducts: "total_products",
} as const;

export type PurchaseRequestReportType =
	(typeof PurchaseRequestReportType)[keyof typeof PurchaseRequestReportType];

export const PurchaseRequestConsolidationType = {
	ByArea: 1,
	TotalProducts: 2,
} as const;

export type PurchaseRequestConsolidationType =
	(typeof PurchaseRequestConsolidationType)[keyof typeof PurchaseRequestConsolidationType];


export interface PurchaseRequestReportsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onGenerate: (message: string) => void;
	isGenerating?: boolean;
}

export const PurchaseRequestReportsOptions: EnumType[] = [
	{
		value: PurchaseRequestReportType.ConsolidatedProducts,
		label: "Consolidado mensual de productos (por área)"
	},
	{
		value: PurchaseRequestReportType.TotalProducts,
		label: "Total de productos mensual"
	},
] as const;
