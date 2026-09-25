import type {
	PurchaseRequestProductInformation,
	PurchaseRequestProductQuotation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetSupplierDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-supplier-details-response";
import { getQuoteTotalPrice } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDate } from "@app/shared/utils/string.utils";
import { resolvePaymentConditionLabel } from "@app/shared/utils/quotation-label.utils";
import { EMPTY_CELL } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/constants/purchase-order-pdf.constants";
import type {
	BuildPurchaseOrderPdfInput,
	PurchaseOrderPdfLineItem,
	PurchaseOrderPdfTotals,
	PurchaseOrderPdfViewModel,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";

type SupplierGroup = {
	supplierId: string;
	supplierNameFallback: string;
	/** First accepted quote found — used for payment condition. */
	representativeQuote: PurchaseRequestProductQuotation;
	items: PurchaseOrderPdfLineItem[];
};

function formatQuantity(value: number): string {
	return new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

function resolveAcceptedQuote(
	quotations: PurchaseRequestProductQuotation[],
): PurchaseRequestProductQuotation | null {
	return quotations.find((quote) => quote.is_accepted_for_purchase) ?? null;
}

function resolveUnitMeasure(product: PurchaseRequestProductInformation): string {
	return (
		product.unit_measure_information?.name?.trim() ||
		product.unit_measure_information?.symbol?.trim() ||
		EMPTY_CELL
	);
}

function resolveDescription(product: PurchaseRequestProductInformation): string {
	return (
		product.description?.trim() ||
		product.product_details?.product_name?.trim() ||
		EMPTY_CELL
	);
}

function resolveCategoryLabel(product: PurchaseRequestProductInformation): string {
	return (
		product.product_details?.category_information?.name?.trim() ||
		product.product_details?.category_information?.code?.trim() ||
		product.product_details?.product_code?.trim() ||
		EMPTY_CELL
	);
}

function resolveSupplierDisplayName(
	supplier: GetSupplierDetailsResponse,
	fallback: string,
): string {
	return (
		supplier.commercial_name?.trim() ||
		supplier.suppliers_legal_name?.trim() ||
		supplier.supplier_legal_name?.trim() ||
		fallback ||
		EMPTY_CELL
	);
}

function buildLineItem(
	product: PurchaseRequestProductInformation,
	quote: PurchaseRequestProductQuotation,
): PurchaseOrderPdfLineItem {
	const rawSubtotal = quote.price ?? 0;
	const rawIva = quote.iva ?? 0;
	const rawTotal = getQuoteTotalPrice(quote);
	const unitPrice = quote.price_unit ?? 0;

	return {
		quantityLabel: formatQuantity(product.quantity ?? 0),
		unitMeasure: resolveUnitMeasure(product),
		productCode: resolveCategoryLabel(product),
		description: resolveDescription(product),
		unitPriceLabel: formatCurrency(unitPrice, "NIO"),
		lineTotalLabel: formatCurrency(rawSubtotal, "NIO"),
		rawSubtotal,
		rawIva,
		rawTotal,
	};
}

function buildTotals(
	items: PurchaseOrderPdfLineItem[],
	discount: number,
	exo: number,
): PurchaseOrderPdfTotals {
	let subtotal = 0;
	let iva = 0;
	let total = 0;

	for (const item of items) {
		subtotal += item.rawSubtotal;
		iva += item.rawIva;
		total += item.rawTotal;
	}

	total = total - discount - exo;

	return {
		subtotalLabel: formatCurrency(subtotal, "NIO"),
		discountLabel: formatCurrency(discount, "NIO"),
		ivaLabel: formatCurrency(iva, "NIO"),
		exoLabel: formatCurrency(exo, "NIO"),
		totalLabel: formatCurrency(total, "NIO"),
	};
}

function groupAcceptedItemsBySupplier(
	products: PurchaseRequestProductInformation[],
): Map<string, SupplierGroup> {
	const itemsBySupplier = new Map<string, SupplierGroup>();

	for (const product of products) {
		const quote = resolveAcceptedQuote(product.quotations ?? []);
		if (!quote) continue;

		const supplierId =
			quote.supplier_id || quote.supplier_information?.supplier_id;
		if (!supplierId) continue;

		let supplierData = itemsBySupplier.get(supplierId);
		if (!supplierData) {
			supplierData = {
				supplierId,
				supplierNameFallback:
					quote.supplier_information?.suppliers_legal_name?.trim() ||
					EMPTY_CELL,
				representativeQuote: quote,
				items: [],
			};
			itemsBySupplier.set(supplierId, supplierData);
		}
		supplierData.items.push(buildLineItem(product, quote));
	}

	return itemsBySupplier;
}

export async function buildPurchaseOrderPdfViewModels({
	detail,
	products,
	companyLogoUrl,
	companyId,
	moduleCode,
	supplierServices,
}: BuildPurchaseOrderPdfInput): Promise<PurchaseOrderPdfViewModel[]> {
	const purchaseRequest =
		detail.purchase_request ?? detail.purchase_request_details;

	const purchaseOrderCode = purchaseRequest?.code?.trim() || EMPTY_CELL;
	const discount = detail.discount ?? 0;
	const exo = detail.exo ?? 0;
	const itemsBySupplier = groupAcceptedItemsBySupplier(products);

	if (itemsBySupplier.size === 0) {
		throw new Error(
			"No hay productos con cotización adjudicada para generar la orden de compra.",
		);
	}

	const supplierGroups = Array.from(itemsBySupplier.values());

	return Promise.all(
		supplierGroups.map(async (supplierData) => {
			let supplierDetails: GetSupplierDetailsResponse | null = null;

			try {
				supplierDetails = await supplierServices.GetSupplierDetails({
					company_id: companyId,
					module_code: moduleCode,
					supplier_id: supplierData.supplierId,
				});
			} catch (error) {
				console.error(
					`Error fetching supplier details for ${supplierData.supplierId}`,
					error,
				);
			}

			const supplierName = supplierDetails
				? resolveSupplierDisplayName(
						supplierDetails,
						supplierData.supplierNameFallback,
					)
				: supplierData.supplierNameFallback;

			const paymentCondition = resolvePaymentConditionLabel(
				supplierData.representativeQuote.payment_method,
			);

			return {
				companyLogoUrl,
				supplierName,
				purchaseOrderCode,
				orderDateLabel: formatDate(
					detail.sent_to_review_at || purchaseRequest?.request_date || "",
				),
				paymentCondition,
				materialsRequest: detail.materials_request?.trim() || "",
				requestingDepartment:
					purchaseRequest?.information_from_requesting_area?.work_area_name?.trim() ||
					detail.work_area_information?.work_area_name?.trim() ||
					EMPTY_CELL,
				notes:
					detail.comments?.trim() ||
					purchaseRequest?.observations?.trim() ||
					"",
				requisitionCode: purchaseOrderCode,
				elaboratedBy:
					detail.sent_by_user_information?.fullname?.trim() || EMPTY_CELL,
				authorizedBy:
					detail.reviewer_user_information?.fullname?.trim() ||
					purchaseRequest?.reviewer_user_information?.fullname?.trim() ||
					"",
				items: supplierData.items,
				totals: buildTotals(supplierData.items, discount, exo),
			};
		}),
	);
}
