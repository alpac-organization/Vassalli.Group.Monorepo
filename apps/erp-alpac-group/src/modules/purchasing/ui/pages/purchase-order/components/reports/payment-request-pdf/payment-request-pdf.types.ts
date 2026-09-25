import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";

export type PaymentRequestPriority = "normal" | "critical";

export type PaymentRequestAmountLine = {
	label: string;
	amount: number;
	emphasize?: boolean;
};

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
	documentType: PaymentMethodType;
	requestNumber: string;
	assignmentNumber?: string | null;
	date: string;
	department: string;
	payee: string;
	concept: string;
	clientAccount: string;
	ruc?: string | null;
	/** Label dinámico según tipo de proveedor: "RUC" o "RUC / Cédula" */
	rucLabel?: string;
	customs?: string | null;
	administrativeFineNumber?: string | null;
	referenceNumber?: string | null;
	declarationNumber?: string | null;
	priority: PaymentRequestPriority;
	amounts: {
		serviceAmount: number;
		exemptServiceAmount?: number;
		disbursementOther?: number;
		iva?: number;
		ir?: number;
		imi?: number;
		other?: number;
		netPayable: number;
		currency?: string;
	};
	checklist?: PaymentRequestChecklistSection[];
	requestedBy?: string | null;
	approvedBy?: string | null;
	authorizedBy?: string | null;
	bankName?: string | null;
	logoUrl?: string | null;
	companyName?: string | null;
};

export type PaymentRequestPdfProps = {
	data: PaymentRequestPdfData;
};
