import { formatCurrency } from "@app/shared/utils/currency.utils";
import { EMPTY_CELL } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/constants/purchase-order-pdf.constants";
import type {
	MapPurchaseOrderReportToPdfInput,
	PurchaseOrderPdfViewModel,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";
import { resolveComprasSealSrc } from "@app/modules/purchasing/ui/pages/purchase-order/utils/resolve-compras-seal";

function formatQuantity(value: number): string {
	return new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value ?? 0);
}

/**
 * Mapea el JSON de GET /reports/purchase-order/{id} al view model del PDF.
 * Una OC = un proveedor; montos vienen de payment_info / items del backend.
 */
export function mapPurchaseOrderReportToPdfViewModel({
	report,
	companyLogoUrl,
	branchName,
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

	const items = (report.items ?? []).map((item) => ({
		quantityLabel: formatQuantity(item.quantity),
		unitMeasure: EMPTY_CELL,
		productCode: item.product_code?.trim() || EMPTY_CELL,
		description:
			item.product_name?.trim() ||
			item.product_code?.trim() ||
			EMPTY_CELL,
		unitPriceLabel: formatCurrency(item.unit_price ?? 0, "NIO"),
		lineTotalLabel: formatCurrency(item.price_total ?? 0, "NIO"),
	}));

	const subtotal = payment?.service_amount ?? 0;
	const iva = payment?.vat ?? 0;
	const exempt = payment?.exempt_service_amount ?? 0;
	const total = payment?.net_to_pay ?? subtotal + iva;

	return {
		companyLogoUrl: logo,
		companyName,
		supplierName: payment?.payee?.trim() || EMPTY_CELL,
		purchaseOrderCode:
			documentInfo?.request_code?.trim() ||
			report.purchase_order_code?.trim() ||
			EMPTY_CELL,
		orderDateLabel: documentInfo?.date?.trim() || EMPTY_CELL,
		paymentCondition: "Crédito",
		materialsRequest: "",
		requestingDepartment: payment?.department?.trim() || EMPTY_CELL,
		notes: report.concept?.trim() || "",
		requisitionCode: EMPTY_CELL,
		elaboratedBy:
			report.sent_by_user_information?.fullname?.trim() || EMPTY_CELL,
		authorizedBy: EMPTY_CELL,
		sealSrc,
		items,
		totals: {
			subtotalLabel: formatCurrency(subtotal, "NIO"),
			discountLabel: formatCurrency(0, "NIO"),
			ivaLabel: formatCurrency(iva, "NIO"),
			exoLabel: formatCurrency(exempt, "NIO"),
			totalLabel: formatCurrency(total, "NIO"),
		},
	};
}
