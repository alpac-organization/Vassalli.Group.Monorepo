import type {
	MapPurchaseOrderReportToPdfInput,
	PurchaseOrderPdfViewModel,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";
import type { PurchaseOrderReportDocumentInfo } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-report-response";
import { resolvePaymentConditionLabel } from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";
import {
	formatPurchaseOrderReportMoney,
	toReportCurrency,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

function formatQuantity(value: number): string {
	return new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value ?? 0);
}

function resolvePriorityLabel(
	documentInfo?: PurchaseOrderReportDocumentInfo | null,
): string {
	if (documentInfo?.is_critical) return "Crítica";
	if (documentInfo?.is_unforeseen) return "Imprevisto";
	return "Normal";
}

export function mapPurchaseOrderReportToPdfViewModel({
	report,
	companyLogoUrl,
	branchName,
}: MapPurchaseOrderReportToPdfInput): PurchaseOrderPdfViewModel {
	const payment = report.payment_info;
	const documentInfo = report.document_info;
	const company = report.company_information;
	const currency = toReportCurrency(payment?.currency);

	const companyName =
		company?.company_name ||
		payment?.customer ||
		"ALMACENADORA DEL PACIFICO, S.A.";

	const sealSrc =
		resolveComprasSealSrc(branchName) ?? resolveComprasSealSrc(companyName);

	const logo = companyLogoUrl || null;

	const items = (report.items ?? []).map((item) => ({
		quantityLabel: formatQuantity(item.quantity),
		unitMeasure: item.unit_measure ?? "",
		productCode: item.product_code ?? "",
		description: item.product_name || item.product_code || "",
		unitPriceLabel: formatPurchaseOrderReportMoney(
			item.unit_price ?? 0,
			currency,
		),
		lineTotalLabel: formatPurchaseOrderReportMoney(
			item.price_total ?? 0,
			currency,
		),
	}));

	const subtotal = payment?.service_amount ?? 0;
	const iva = payment?.iva ?? 0;
	const total = payment?.net_to_pay ?? subtotal + iva;

	return {
		companyLogoUrl: logo,
		companyName,
		supplierName: payment?.supplier ?? "",
		purchaseOrderCode: report.purchase_order_code ?? "",
		orderDateLabel: documentInfo?.date ?? "",
		paymentCondition: resolvePaymentConditionLabel(report.payment_condition),
		priorityLabel: resolvePriorityLabel(documentInfo),
		materialsRequest: "",
		requestingDepartment: payment?.department ?? "",
		notes: report.concept ?? "",
		paymentRequestCode: report.payment_request_code ?? "",
		elaboratedBy: report.sent_by_user_information?.fullname ?? "",
		sealSrc,
		items,
		totals: {
			subtotalLabel: formatPurchaseOrderReportMoney(subtotal, currency),
			ivaLabel: formatPurchaseOrderReportMoney(iva, currency),
			totalLabel: formatPurchaseOrderReportMoney(total, currency),
		},
	};
}
