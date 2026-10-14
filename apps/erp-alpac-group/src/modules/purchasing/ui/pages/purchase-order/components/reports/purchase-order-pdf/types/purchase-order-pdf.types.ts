import type { PurchaseOrderTemplateDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-report-response";

export interface PurchaseOrderPdfLineItem {
	quantityLabel: string;
	unitMeasure: string;
	productCode: string;
	description: string;
	unitPriceLabel: string;
	lineTotalLabel: string;
}

export interface PurchaseOrderPdfTotals {
	subtotalLabel: string;
	discountLabel: string;
	ivaLabel: string;
	exoLabel: string;
	totalLabel: string;
}

export interface PurchaseOrderPdfViewModel {
	companyLogoUrl?: string | null;
	companyName: string;
	supplierName: string;
	purchaseOrderCode: string;
	orderDateLabel: string;
	paymentCondition: string;
	materialsRequest: string;
	requestingDepartment: string;
	notes: string;
	requisitionCode: string;
	elaboratedBy: string;
	authorizedBy: string;
	sealSrc?: string | null;
	items: PurchaseOrderPdfLineItem[];
	totals: PurchaseOrderPdfTotals;
}

export interface PurchaseOrderPdfDocumentProps {
	viewModel: PurchaseOrderPdfViewModel;
}

export interface FetchPurchaseOrderPdfParams {
	companyId: string;
	moduleCode: string;
	purchaseOrderId: string;
	/** Nombre de sucursal para resolver sello (opcional). */
	branchName?: string | null;
}

export type MapPurchaseOrderReportToPdfInput = {
	report: PurchaseOrderTemplateDto;
	companyLogoUrl?: string | null;
	branchName?: string | null;
};
