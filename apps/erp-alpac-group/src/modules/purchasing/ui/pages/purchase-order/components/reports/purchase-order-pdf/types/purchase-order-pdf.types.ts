import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface PurchaseOrderPdfLineItem {
	quantityLabel: string;
	unitMeasure: string;
	productCode: string;
	description: string;
	unitPriceLabel: string;
	lineTotalLabel: string;
	rawSubtotal: number;
	rawIva: number;
	rawTotal: number;
}

export interface PurchaseOrderPdfTotals {
	subtotalLabel: string;
	discountLabel: string;
	ivaLabel: string;
	exoLabel: string;
	totalLabel: string;
}

export interface PurchaseOrderPdfViewModel {
	companyLogoUrl?: string;
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
	items: PurchaseOrderPdfLineItem[];
	totals: PurchaseOrderPdfTotals;
}

export interface PurchaseOrderPdfDocumentProps {
	viewModels: PurchaseOrderPdfViewModel[];
}

export interface FetchPurchaseOrderPdfParams {
	companyId: string;
	moduleCode: string;
	purchaseOrderId: string;
	purchaseRequestId?: string;
}

export type BuildPurchaseOrderPdfInput = {
	detail: GetPurchaseOrderDetailsResponse;
	products: PurchaseRequestProductInformation[];
	companyLogoUrl?: string;
	companyId: string;
	moduleCode: string;
	supplierServices: import("@app/modules/purchasing/infrastructure/services/supplier/SupplierServices").SupplierServices;
};
