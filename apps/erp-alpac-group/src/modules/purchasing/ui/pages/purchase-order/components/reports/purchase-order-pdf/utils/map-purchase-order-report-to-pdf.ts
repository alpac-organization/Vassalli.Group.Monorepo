import { EMPTY_CELL } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/constants/purchase-order-pdf.constants";
import type {
	MapPurchaseOrderReportToPdfInput,
	PurchaseOrderPdfViewModel,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";
import type { PurchaseOrderReportDocumentInfo } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-report-response";
import { resolvePaymentConditionLabel } from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";
import {
	buildPurchaseRequestProductMap,
	formatPurchaseOrderReportMoney,
	resolveAcceptedQuoteCurrency,
	resolveSharedReportCurrency,
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
	purchaseRequestProducts,
}: MapPurchaseOrderReportToPdfInput): PurchaseOrderPdfViewModel {
	const payment = report.payment_info;
	const documentInfo = report.document_info;
	const company = report.company_information;

	const companyName =
		company?.company_name?.trim() ||
		company?.alias?.trim() ||
		payment?.customer?.trim() ||
		"ALMACENADORA DEL PACIFICO, S.A.";

	const sealSrc =
		resolveComprasSealSrc(branchName) ??
		resolveComprasSealSrc(companyName) ??
		resolveComprasSealSrc(company?.alias);

	const logo =
		companyLogoUrl?.trim() ||
		(typeof company?.image_url === "string" ? company.image_url.trim() : "") ||
		null;

	const productByItemId = buildPurchaseRequestProductMap(
		purchaseRequestProducts,
	);
	const reportItems = report.items ?? [];
	const itemCurrencies = reportItems.map((item) => {
		const requestItemId = item.purchase_request_item_id?.trim();
		if (!requestItemId) return undefined;
		return resolveAcceptedQuoteCurrency(productByItemId.get(requestItemId));
	});
	const totalsCurrency = resolveSharedReportCurrency(itemCurrencies);

	const items = reportItems.map((item, index) => {
		const currency = itemCurrencies[index];
		return {
			quantityLabel: formatQuantity(item.quantity),
			unitMeasure: EMPTY_CELL,
			productCode: item.product_code?.trim() || EMPTY_CELL,
			description:
				item.product_name?.trim() || item.product_code?.trim() || EMPTY_CELL,
			unitPriceLabel: formatPurchaseOrderReportMoney(
				item.unit_price ?? 0,
				currency,
			),
			lineTotalLabel: formatPurchaseOrderReportMoney(
				item.price_total ?? 0,
				currency,
			),
		};
	});

	const subtotal = payment?.service_amount ?? 0;
	const iva = payment?.iva ?? payment?.vat ?? 0;
	const total = payment?.net_to_pay ?? subtotal + iva;

	return {
		companyLogoUrl: logo,
		companyName,
		supplierName:
			payment?.supplier?.trim() || payment?.payee?.trim() || EMPTY_CELL,
		purchaseOrderCode: report.purchase_order_code?.trim() || EMPTY_CELL,
		orderDateLabel: documentInfo?.date?.trim() || EMPTY_CELL,
		paymentCondition: resolvePaymentConditionLabel(report.payment_condition),
		priorityLabel: resolvePriorityLabel(documentInfo),
		materialsRequest: "",
		requestingDepartment: payment?.department?.trim() || EMPTY_CELL,
		notes: report.concept?.trim() || "",
		paymentRequestCode: report.payment_request_code?.trim() || EMPTY_CELL,
		elaboratedBy:
			report.sent_by_user_information?.fullname?.trim() || EMPTY_CELL,
		authorizedBy: EMPTY_CELL,
		sealSrc,
		items,
		totals: {
			subtotalLabel: formatPurchaseOrderReportMoney(subtotal, totalsCurrency),
			ivaLabel: formatPurchaseOrderReportMoney(iva, totalsCurrency),
			totalLabel: formatPurchaseOrderReportMoney(total, totalsCurrency),
		},
	};
}
