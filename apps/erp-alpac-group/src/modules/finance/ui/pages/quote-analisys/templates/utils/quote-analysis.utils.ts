import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type {
	PurchaseRequestProductInformation,
	PurchaseRequestProductQuotation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatTimeTypeLabel } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/utils/format-type-label";
import { getQuoteTotalPrice } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import {
	resolvePaymentConditionLabel,
	resolveProductQualityLabel,
	resolveInventoryAvailabilityLabel,
} from "@app/shared/utils/quotation-label.utils";
import type {
	QuoteAnalysisPdfSupplier,
	QuoteAnalysisPdfItemRow,
	QuoteAnalysisPdfTotals,
	QuoteAnalysisPdfQualitative,
	QuoteAnalysisPdfViewModel,
	QuoteAnalysisPdfItemCell,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";
import {
	EMPTY_CELL,
	PROVIDER_HEADER_COLORS,
	PROVIDERS_TOTAL_WIDTH,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/constants/quote-analysis-report";

const PROVIDERS_WIDTH_PCT = Number.parseFloat(PROVIDERS_TOTAL_WIDTH);

export const SUPPLIERS_PER_PAGE_CHUNK = 2;

export function chunkArray<T>(items: T[], size: number): T[][] {
	const chunkSize = Math.max(size, 1);
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		chunks.push(items.slice(i, i + chunkSize));
	}
	return chunks;
}

export function chunkSuppliers(
	suppliers: QuoteAnalysisPdfSupplier[],
	size = SUPPLIERS_PER_PAGE_CHUNK,
): QuoteAnalysisPdfSupplier[][] {
	const chunks = chunkArray(suppliers, size);
	return chunks.length > 0 ? chunks : [[]];
}

export function getProviderBlockWidth(supplierCount: number): string {
	const count = Math.max(supplierCount, 1);
	return `${PROVIDERS_WIDTH_PCT / count}%`;
}

export function getProviderHeaderColor(index: number): string {
	return PROVIDER_HEADER_COLORS[index % PROVIDER_HEADER_COLORS.length];
}

export function getQualitativeProviderWidth(supplierCount: number): string {
	const count = Math.max(supplierCount, 1);
	const width = 72;
	return `${width / count}%`;
}

function resolveSupplierId(
	quote: PurchaseRequestProductQuotation,
): string | undefined {
	return quote.supplier_id || quote.supplier_information?.supplier_id || undefined;
}

function resolveSupplierName(quote: PurchaseRequestProductQuotation): string {
	return quote.supplier_information?.suppliers_legal_name?.trim() || EMPTY_CELL;
}

function emptyTotals(supplierIds: string[]): QuoteAnalysisPdfTotals {
	const subtotal: Record<string, number> = {};
	const iva: Record<string, number> = {};
	const total: Record<string, number> = {};
	for (const id of supplierIds) {
		subtotal[id] = 0;
		iva[id] = 0;
		total[id] = 0;
	}
	return { subtotal, iva, total };
}

function indexQuotesBySupplier(
	quotations: PurchaseRequestProductQuotation[],
): Map<string, PurchaseRequestProductQuotation> {
	const map = new Map<string, PurchaseRequestProductQuotation>();
	for (const quote of quotations) {
		const supplierId = resolveSupplierId(quote);
		if (!supplierId || map.has(supplierId)) continue;
		map.set(supplierId, quote);
	}
	return map;
}

function formatDelivery(quote: PurchaseRequestProductQuotation): string {
	if (quote.delivery_time == null) return EMPTY_CELL;
	const type = formatTimeTypeLabel(quote.delivery_time_type);
	return `${quote.delivery_time} ${type}`.trim();
}

function formatWarranty(quote: PurchaseRequestProductQuotation): string {
	if (quote.warranty_period == null) return EMPTY_CELL;
	const type = formatTimeTypeLabel(quote.warranty_period_time_type);
	return `${quote.warranty_period} ${type}`.trim();
}

function buildItemCell(quote: PurchaseRequestProductQuotation): QuoteAnalysisPdfItemCell {
	const rawPrice = quote.price ?? 0;
	const rawIva = quote.iva ?? 0;
	const rawTotal = getQuoteTotalPrice(quote);

	return {
		brand: quote.brand_product?.trim() || EMPTY_CELL,
		unitPrice: formatCurrency(quote.price_unit ?? 0, "NIO"),
		iva: formatCurrency(rawIva, "NIO"),
		total: formatCurrency(rawTotal, "NIO"),
		rawPrice,
		rawIva,
		rawTotal,
	};
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

export function buildQuoteAnalysisPdfViewModel(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[],
): QuoteAnalysisPdfViewModel {
	const suppliersMap = new Map<string, QuoteAnalysisPdfSupplier>();
	const representativeQuotes = new Map<string, PurchaseRequestProductQuotation>();
	const selectedBySupplier = new Map<
		string,
		{ name: string; justifications: string[] }
	>();

	for (const product of products) {
		for (const quote of product.quotations ?? []) {
			const supplierId = resolveSupplierId(quote);

			if (quote.is_accepted_for_purchase) {
				const selectionKey = supplierId || quote.quotation_id;
				if (selectionKey) {
					const name = resolveSupplierName(quote);
					const justification = quote.supplier_selection_justification?.trim();
					const entry = selectedBySupplier.get(selectionKey) ?? {
						name,
						justifications: [],
					};
					if (justification && !entry.justifications.includes(justification)) {
						entry.justifications.push(justification);
					}
					selectedBySupplier.set(selectionKey, entry);
				}
			}

			if (!supplierId) continue;

			if (!suppliersMap.has(supplierId)) {
				suppliersMap.set(supplierId, {
					supplierId,
					name: resolveSupplierName(quote),
				});
			}

			const existingRepresentative = representativeQuotes.get(supplierId);
			if (quote.is_accepted_for_purchase) {
				if (!existingRepresentative?.is_accepted_for_purchase) {
					representativeQuotes.set(supplierId, quote);
				}
			} else if (!existingRepresentative) {
				representativeQuotes.set(supplierId, quote);
			}
		}
	}

	const suppliers = Array.from(suppliersMap.values());
	const supplierIds = suppliers.map((s) => s.supplierId);
	const totals = emptyTotals(supplierIds);
	const items: QuoteAnalysisPdfItemRow[] = [];

	for (const product of products) {
		const quotesBySupplier = indexQuotesBySupplier(product.quotations ?? []);
		const cellsBySupplierId: QuoteAnalysisPdfItemRow["cellsBySupplierId"] = {};

		for (const supplier of suppliers) {
			const quote = quotesBySupplier.get(supplier.supplierId);
			if (!quote) {
				cellsBySupplierId[supplier.supplierId] = null;
				continue;
			}

			const cell = buildItemCell(quote);
			cellsBySupplierId[supplier.supplierId] = cell;
			totals.subtotal[supplier.supplierId] += cell.rawPrice;
			totals.iva[supplier.supplierId] += cell.rawIva;
			totals.total[supplier.supplierId] += cell.rawTotal;
		}

		items.push({
			quantity: String(product.quantity ?? EMPTY_CELL),
			unitMeasure: resolveUnitMeasure(product),
			description: resolveDescription(product),
			cellsBySupplierId,
		});
	}

	const qualitative: QuoteAnalysisPdfQualitative = {
		delivery: {},
		transport: {},
		warranty: {},
		quality: {},
		inventory: {},
		paymentMethod: {},
	};

	for (const supplier of suppliers) {
		const quote = representativeQuotes.get(supplier.supplierId);
		qualitative.delivery[supplier.supplierId] = quote
			? formatDelivery(quote)
			: EMPTY_CELL;
		qualitative.transport[supplier.supplierId] = quote
			? quote.has_delivery
				? "Sí"
				: "No"
			: EMPTY_CELL;
		qualitative.warranty[supplier.supplierId] = quote
			? formatWarranty(quote)
			: EMPTY_CELL;
		qualitative.quality[supplier.supplierId] = quote
			? resolveProductQualityLabel(quote.product_quality)
			: EMPTY_CELL;
		qualitative.inventory[supplier.supplierId] = quote
			? resolveInventoryAvailabilityLabel(quote)
			: EMPTY_CELL;
		qualitative.paymentMethod[supplier.supplierId] = quote
			? resolvePaymentConditionLabel(quote.payment_method)
			: EMPTY_CELL;
	}

	const selected = Array.from(selectedBySupplier.values());
	const selectedSupplierNames =
		selected.map((s) => s.name).filter(Boolean).join(", ") || EMPTY_CELL;
	const justification =
		selected
			.map((s) => {
				const text = s.justifications.join(" ");
				return text ? `${s.name}: ${text}` : null;
			})
			.filter(Boolean)
			.join(". ") || EMPTY_CELL;

	const elaboratedBy =
		detail.purchase_request?.creator_user_information?.fullname?.trim() ||
		detail.sent_by_user_information?.fullname?.trim() ||
		EMPTY_CELL;

	return {
		suppliers,
		items,
		totals,
		qualitative,
		selectedSupplierNames,
		justification,
		elaboratedBy,
	};
}
