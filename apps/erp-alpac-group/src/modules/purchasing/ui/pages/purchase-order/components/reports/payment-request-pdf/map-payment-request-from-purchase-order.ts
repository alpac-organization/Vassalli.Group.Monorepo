import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import { formatDate } from "@app/shared/utils/string.utils";
import { DEFAULT_PAYMENT_REQUEST_CHECKLIST } from "./payment-request-pdf.checklist";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";

type PaymentRequestPurchaseSource = {
	observations?: string | null;
	code?: string | null;
	request_date?: string | null;
	priority_level?: string | null;
	information_from_requesting_area?: { work_area_name?: string | null } | null;
	work_area_information?: { work_area_name?: string | null } | null;
};

export type PaymentRequestDocumentDetails = {
	purchase_order_id?: string | null;
	sent_to_review_at?: string | null;
	sent_by_user_information?: { fullname?: string | null } | null;
	reviewer_user_information?: { fullname?: string | null } | null;
	purchase_request_details?: PaymentRequestPurchaseSource | null;
	purchase_request?: PaymentRequestPurchaseSource | null;
};

type MapPaymentRequestArgs = {
	documentType: PaymentMethodType;
	details: PaymentRequestDocumentDetails;
	products: PurchaseRequestProductInformation[];
	logoUrl?: string | null;
	companyName?: string | null;
	bankName?: string | null;
	generatedBy?: string | null;
	generatedAt?: string | null;
};

const getAcceptedQuotations = (products: PurchaseRequestProductInformation[]) =>
	products
		.flatMap((product) => product.quotations ?? [])
		.filter((quote) => quote.is_accepted_for_purchase);

const isLegalSupplierIdentification = (identificationType?: string | number | null) => {
	if (identificationType == null || identificationType === "") return false;

	if (typeof identificationType === "number") {
		return identificationType === IdentificationEnum.RUC.value;
	}

	const normalized = identificationType.trim().toLowerCase();
	return (
		normalized === IdentificationEnum.RUC.stringValue.toLowerCase() ||
		normalized === "ruc" ||
		normalized === String(IdentificationEnum.RUC.value)
	);
};

const resolveRucLabel = (identificationType?: string | number | null) =>
	isLegalSupplierIdentification(identificationType) ? "RUC" : "RUC / Cédula";

export function mapPurchaseOrderToPaymentRequestPdf({
	documentType,
	details,
	products,
	logoUrl,
	companyName,
	bankName,
	generatedBy,
	generatedAt,
}: MapPaymentRequestArgs): PaymentRequestPdfData {
	const purchaseRequest =
		details.purchase_request_details ?? details.purchase_request;

	const acceptedQuotes = getAcceptedQuotations(products);
	const supplierInfo = acceptedQuotes[0]?.supplier_information;

	const serviceAmount = acceptedQuotes.reduce(
		(sum, quote) => sum + (quote.price ?? 0),
		0,
	);
	const iva = acceptedQuotes.reduce((sum, quote) => sum + (quote.iva ?? 0), 0);
	const netPayable = acceptedQuotes.reduce(
		(sum, quote) => sum + (quote.price_total ?? quote.price ?? 0) + (quote.iva ?? 0),
		0,
	);

	const supplierLegalName = supplierInfo?.suppliers_legal_name?.trim() || null;
	const supplierIdentification =
		supplierInfo?.identification_number?.trim() || null;

	const selectedSupplier = supplierLegalName || supplierIdentification || "Proveedor";

	const conceptFromProducts = products
		.map((product) => {
			const name = product.product_details.product_name?.trim();
			const description = product.description?.trim();
			const qty = product.quantity;
			if (!name && !description) return null;
			return `${qty} × ${name || description}`;
		})
		.filter(Boolean)
		.join("; ");

	const concept =
		purchaseRequest?.observations?.trim() ||
		conceptFromProducts ||
		"Compra según orden de compra";

	const quotesCount = acceptedQuotes.length;
	const checklist = DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => ({
		title: section.title,
		items: section.items.map((item) => {
			if (item.id === "quotes") {
				return {
					...item,
					description: `Cotizaciones efectuadas, cantidad ( ${quotesCount} ).`,
					checked: quotesCount > 0,
				};
			}
			if (item.id === "signed-request") {
				return {
					...item,
					description:
						documentType === PaymentMethodEnum.Check.textValue
							? "Solicitud de cheque firmada por el departamento solicitante."
							: "Solicitud de transferencia firmada por el departamento solicitante.",
				};
			}
			return { ...item };
		}),
	}));

	const isCritical =
		purchaseRequest?.priority_level === PriorityLevelEnum.Critical.textValue ||
		purchaseRequest?.priority_level === PriorityLevelEnum.Unforeseen.textValue;

	return {
		documentType,
		requestNumber: purchaseRequest?.code?.trim() || details.purchase_order_id || "—",
		assignmentNumber: null,
		date: formatDate(
			purchaseRequest?.request_date || details.sent_to_review_at || "",
		),
		department:
			purchaseRequest?.information_from_requesting_area?.work_area_name?.trim() ||
			purchaseRequest?.work_area_information?.work_area_name?.trim() ||
			"—",
		payee: selectedSupplier,
		concept,
		clientAccount: supplierLegalName || selectedSupplier,
		ruc: supplierIdentification,
		rucLabel: resolveRucLabel(supplierInfo?.identification_type),
		customs: "N/A",
		referenceNumber: null,
		priority: isCritical ? "critical" : "normal",
		amounts: {
			serviceAmount,
			exemptServiceAmount: 0,
			disbursementOther: 0,
			iva,
			ir: 0,
			imi: 0,
			other: 0,
			netPayable: netPayable || serviceAmount + iva,
			currency: "NIO",
		},
		checklist,
		requestedBy: details.sent_by_user_information?.fullname ?? null,
		approvedBy: details.reviewer_user_information?.fullname ?? null,
		authorizedBy: null,
		bankName: bankName ?? null,
		generatedBy: generatedBy ?? null,
		generatedAt: generatedAt ?? null,
		logoUrl: logoUrl ?? null,
		companyName: companyName ?? "ALMACENADORA DEL PACIFICO, S.A.",
	};
}
