import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { TransferRequestReportDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-transfer-request-report-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { buildPaymentRequestChecklist } from "./payment-request-pdf.checklist";
import type {
	PaymentRequestChecklistSection,
	PaymentRequestPdfData,
} from "./payment-request-pdf.types";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";
import {
	buildPurchaseRequestProductMap,
	resolveAcceptedQuoteCurrency,
	resolveSharedReportCurrency,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

type MapTransferRequestReportArgs = {
	report: TransferRequestReportDto;
	documentType: PaymentMethodType;
	logoUrl?: string | null;
	companyNameFallback?: string | null;
	bankName?: string | null;
	branchName?: string | null;
	generatedBy?: string | null;
	generatedAt?: string | null;
	checklist?: PaymentRequestChecklistSection[];
	referenceNumber?: string | null;
	purchaseRequestProducts?: PurchaseRequestProductInformation[];
};

export function mapTransferRequestReportToPdf({
	report,
	documentType,
	logoUrl,
	companyNameFallback,
	bankName,
	branchName,
	generatedBy,
	generatedAt,
	checklist,
	referenceNumber,
	purchaseRequestProducts,
}: MapTransferRequestReportArgs): PaymentRequestPdfData {
	const payment = report.payment_info;
	const documentInfo = report.document_info;
	const company = report.company_information;

	const serviceAmount = payment?.service_amount ?? 0;
	const iva = payment?.iva ?? 0;
	const ir = payment?.ir ?? 0;
	const imi = payment?.imi ?? 0;
	const netPayable = payment?.net_to_pay ?? serviceAmount + iva - ir - imi;

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
		"—";

	const title =
		report.title?.trim() ||
		documentInfo?.title?.trim() ||
		"Solicitud de pago";

	const trimmedReference = referenceNumber?.trim();
	const resolvedReference =
		trimmedReference && trimmedReference.length > 0
			? trimmedReference
			: null;

	const productByItemId = buildPurchaseRequestProductMap(
		purchaseRequestProducts,
	);
	const itemCurrencies = (report.items ?? []).map((item) => {
		const requestItemId = item.purchase_request_item_id?.trim();
		if (!requestItemId) return undefined;
		return resolveAcceptedQuoteCurrency(productByItemId.get(requestItemId));
	});
	const sharedCurrency = resolveSharedReportCurrency(itemCurrencies);

	const resolvedChecklist =
		checklist ?? buildPaymentRequestChecklist(new Set());

	return {
		title,
		documentType:
			documentType === PaymentMethodEnum.Check.textValue
				? PaymentMethodEnum.Check.textValue
				: PaymentMethodEnum.BankTransfer.textValue,
		requestNumber: requestCode,
		assignmentNumber: null,
		date: documentInfo?.date?.trim() || "—",
		department: payment?.department?.trim() || "—",
		payee: payment?.supplier?.trim() || "—",
		concept: report.concept?.trim() || "—",
		clientAccount:
			payment?.customer?.trim() ||
			company?.company_name?.trim() ||
			companyName,
		ruc: null,
		rucLabel: "RUC",
		customs: "N/A",
		administrativeFineNumber: null,
		referenceNumber: resolvedReference,
		declarationNumber: null,
		amounts: {
			serviceAmount,
			exemptServiceAmount: 0,
			disbursementOther: 0,
			iva,
			ir,
			imi,
			other: 0,
			netPayable,
			currency: sharedCurrency,
		},
		checklist: resolvedChecklist,
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
