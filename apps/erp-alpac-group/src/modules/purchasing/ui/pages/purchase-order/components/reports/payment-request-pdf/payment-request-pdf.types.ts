import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PurchaseOrderReportCurrency } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

export type PaymentRequestChecklistItem = {
	id: string;
	description: string;
	checked?: boolean;
	accountingComments?: string;
};

export type PaymentRequestChecklistSection = {
	title: string;
	items: PaymentRequestChecklistItem[];
};

export type PaymentRequestPdfData = {
	title: string;
	documentType: PaymentMethodType;
	requestNumber: string;
	date: string;
	department: string;
	payee: string;
	concept: string;
	clientAccount: string;
	referenceNumber?: string | null;
	amounts: {
		serviceAmount: number;
		iva: number;
		ir: number;
		imi: number;
		netPayable: number;
		currency?: PurchaseOrderReportCurrency;
	};
	checklist?: PaymentRequestChecklistSection[];
	requestedBy?: string | null;
	approvedBy?: string | null;
	bankName?: string | null;
	logoUrl?: string | null;
	companyName?: string | null;
	sealSrc?: string | null;
};

export type PaymentRequestPdfProps = {
	data: PaymentRequestPdfData;
};
