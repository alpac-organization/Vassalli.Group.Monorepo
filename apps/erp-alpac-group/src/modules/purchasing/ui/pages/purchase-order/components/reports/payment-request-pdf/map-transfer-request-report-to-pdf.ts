import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PurchaseOrderTemplateDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-report-response";
import { DEFAULT_PAYMENT_REQUEST_CHECKLIST } from "./payment-request-pdf.checklist";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";

type MapTransferRequestReportArgs = {
	report: PurchaseOrderTemplateDto;
	documentType: PaymentMethodType;
	logoUrl?: string | null;
	companyNameFallback?: string | null;
	bankName?: string | null;
	branchName?: string | null;
	generatedBy?: string | null;
	generatedAt?: string | null;
};

/**
 * Mapea GET /reports/transfer-request/{id} al modelo del PDF de solicitud de pago.
 * Confía en payment_info / tax del backend (IR/IMI / neto).
 */
export function mapTransferRequestReportToPdf({
	report,
	documentType,
	logoUrl,
	companyNameFallback,
	bankName,
	branchName,
	generatedBy,
	generatedAt,
}: MapTransferRequestReportArgs): PaymentRequestPdfData {
	const payment = report.payment_info;
	const documentInfo = report.document_info;
	const tax = report.tax;
	const company = report.company_information;

	const retentionsApplied = tax?.retentions_applied !== false;
	const incomeTax = retentionsApplied ? (payment?.income_tax ?? tax?.ir_amount ?? 0) : 0;
	const municipalTax = retentionsApplied
		? (payment?.municipal_tax ?? tax?.imi_amount ?? 0)
		: 0;

	const serviceAmount = payment?.service_amount ?? 0;
	const vat = payment?.vat ?? 0;
	const netPayable =
		payment?.net_to_pay ??
		serviceAmount + vat - incomeTax - municipalTax;

	const companyName =
		company?.company_name?.trim() ||
		company?.alias?.trim() ||
		payment?.customer?.trim() ||
		companyNameFallback?.trim() ||
		"ALMACENADORA DEL PACIFICO, S.A.";

	const sealSrc =
		resolveComprasSealSrc(branchName) ??
		resolveComprasSealSrc(companyName) ??
		resolveComprasSealSrc(company?.alias);

	const requestCode =
		documentInfo?.request_code?.trim() ||
		report.payment_request_code?.trim() ||
		tax?.payment_request_code?.trim() ||
		report.purchase_order_code?.trim() ||
		"—";

	const isCritical = Boolean(documentInfo?.is_critical);
	const isNormal =
		documentInfo?.is_normal != null
			? Boolean(documentInfo.is_normal)
			: !isCritical;

	return {
		documentType:
			documentType === PaymentMethodEnum.Check.textValue
				? PaymentMethodEnum.Check.textValue
				: PaymentMethodEnum.BankTransfer.textValue,
		requestNumber: requestCode,
		assignmentNumber: documentInfo?.assignment_number ?? null,
		date: documentInfo?.date?.trim() || "—",
		department: payment?.department?.trim() || "—",
		payee: payment?.payee?.trim() || "—",
		concept: report.concept?.trim() || "—",
		clientAccount:
			payment?.customer?.trim() ||
			company?.company_name?.trim() ||
			companyName,
		ruc: null,
		rucLabel: "RUC",
		customs: payment?.customs ?? "N/A",
		administrativeFineNumber: documentInfo?.administrative_fine_number ?? null,
		referenceNumber: documentInfo?.reference_number ?? null,
		declarationNumber: documentInfo?.declaration_number ?? null,
		priority: isCritical ? "critical" : isNormal ? "normal" : "normal",
		amounts: {
			serviceAmount,
			exemptServiceAmount: payment?.exempt_service_amount ?? 0,
			disbursementOther: payment?.other_disbursement ?? 0,
			iva: vat,
			ir: incomeTax,
			imi: municipalTax,
			other: payment?.others ?? 0,
			netPayable,
			currency: "NIO",
		},
		checklist: DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => ({
			title: section.title,
			items: section.items.map((item) => ({ ...item })),
		})),
		requestedBy: report.sent_by_user_information?.fullname?.trim() || null,
		approvedBy: null,
		authorizedBy: null,
		bankName: bankName?.trim() || null,
		logoUrl:
			logoUrl?.trim() ||
			(typeof company?.image_url === "string" ? company.image_url : null),
		companyName,
		sealSrc,
		generatedBy: generatedBy?.trim() || null,
		generatedAt: generatedAt ?? null,
	};
}
