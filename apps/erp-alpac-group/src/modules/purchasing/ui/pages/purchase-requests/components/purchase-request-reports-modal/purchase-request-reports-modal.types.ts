import type { EnumType } from "@app/shared/types/enum.type";

export const PurchaseRequestReportType = {
	ConsolidatedProducts: "consolidated_products",
} as const;

export type PurchaseRequestReportType =
	(typeof PurchaseRequestReportType)[keyof typeof PurchaseRequestReportType];


export interface PurchaseRequestReportsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onGenerate: (message: string) => void;
	isGenerating?: boolean;
}

export const PurchaseRequestReportsOptions: EnumType[] = [
	{
		value: PurchaseRequestReportType.ConsolidatedProducts,
		label: "Consolidado mensual de productos"
	},
] as const;
