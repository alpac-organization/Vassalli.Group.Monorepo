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
	assignmentNumber?: string | null;
	date: string;
	department: string;
	payee: string;
	concept: string;
	clientAccount: string;
	ruc?: string | null;
	rucLabel?: string;
	customs?: string | null;
	administrativeFineNumber?: string | null;
	referenceNumber?: string | null;
	declarationNumber?: string | null;
	amounts: {
		serviceAmount: number;
		exemptServiceAmount?: number;
		disbursementOther?: number;
		iva?: number;
		ir?: number;
		imi?: number;
		other?: number;
		netPayable: number;
		currency?: PurchaseOrderReportCurrency;
	};
	checklist?: PaymentRequestChecklistSection[];
	requestedBy?: string | null;
	approvedBy?: string | null;
	authorizedBy?: string | null;
	bankName?: string | null;
	logoUrl?: string | null;
	companyName?: string | null;
	sealSrc?: string | null;
	generatedBy?: string | null;
	generatedAt?: string | null;
};

export type PaymentRequestPdfProps = {
	data: PaymentRequestPdfData;
};
