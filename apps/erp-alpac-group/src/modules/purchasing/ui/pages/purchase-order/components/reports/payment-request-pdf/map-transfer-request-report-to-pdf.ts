import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { TransferRequestReportDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-transfer-request-report-response";
import { buildPaymentRequestChecklist } from "./payment-request-pdf.checklist";
import type {
	PaymentRequestChecklistSection,
	PaymentRequestPdfData,
} from "./payment-request-pdf.types";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";
import { toReportCurrency } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

type MapTransferRequestReportArgs = {
	report: TransferRequestReportDto;
	documentType: PaymentMethodType;
	logoUrl?: string | null;
	companyNameFallback?: string | null;
	bankName?: string | null;
	branchName?: string | null;
	checklist?: PaymentRequestChecklistSection[];
	referenceNumber?: string | null;
};

export function mapTransferRequestReportToPdf({
	report,
	documentType,
	logoUrl,
	companyNameFallback,
	bankName,
	branchName,
	checklist,
	referenceNumber,
}: MapTransferRequestReportArgs): PaymentRequestPdfData {
	const payment = report.payment_info;
	const documentInfo = report.document_info;
	const company = report.company_information;

	const serviceAmount = payment.service_amount;
	const iva = payment.iva;
	const ir = payment.ir;
	const imi = payment.imi;
	const netPayable = payment.net_to_pay;
	const currency = toReportCurrency(payment.currency);

	const companyName =
		company?.company_name ||
		payment.customer ||
		companyNameFallback ||
		"ALMACENADORA DEL PACIFICO, S.A.";

	const sealSrc =
		resolveComprasSealSrc(branchName) ?? resolveComprasSealSrc(companyName);

	const resolvedChecklist =
		checklist ?? buildPaymentRequestChecklist(new Set());

	return {
		title: report.title || documentInfo.title || "Solicitud de pago",
		documentType:
			documentType === PaymentMethodEnum.Check.textValue
				? PaymentMethodEnum.Check.textValue
				: PaymentMethodEnum.BankTransfer.textValue,
		requestNumber: documentInfo.request_code || report.payment_request_code,
		date: documentInfo.date,
		department: payment.department ?? "",
		payee: payment.supplier ?? "",
		concept: report.concept ?? "",
		clientAccount:
			payment.customer || company?.company_name || companyName,
		referenceNumber: referenceNumber || null,
		amounts: {
			serviceAmount,
			iva,
			ir,
			imi,
			netPayable,
			currency,
		},
		checklist: resolvedChecklist,
		requestedBy: report.sent_by_user_information?.fullname ?? null,
		approvedBy: report.approved_by_user_information?.fullname ?? null,
		bankName: bankName || null,
		logoUrl: logoUrl || null,
		companyName,
		sealSrc,
	};
}
