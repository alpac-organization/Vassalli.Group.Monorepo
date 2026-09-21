import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type {
	PurchaseRequestProductInformation,
	PurchaseRequestProductQuotation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatTimeTypeLabel } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/utils/format-type-label";
import { getQuoteTotalPrice } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type 
{ QuoteAnalysisPdfSupplier, QuoteAnalysisPdfItemRow, QuoteAnalysisPdfTotals,
  QuoteAnalysisPdfQualitative, QuoteAnalysisPdfViewModel
} from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";

const PROVIDER_HEADER_COLORS = ["#BDD7EE", "#FCE4D6", "#C6EFCE"] as const;

export const PROVIDERS_GROUP_HEADER_COLOR = "#D9E1F2";

export function getProviderHeaderColor(index: number): string {
	return PROVIDER_HEADER_COLORS[index % PROVIDER_HEADER_COLORS.length];
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


export function collectUniqueSuppliers(
	products: PurchaseRequestProductInformation[],
): QuoteAnalysisPdfSupplier[] {
	const map = new Map<string, QuoteAnalysisPdfSupplier>();
	for (const product of products) {
		for (const quote of product.quotations ?? []) {
			const supplierId = quote.supplier_id || quote.supplier_information?.supplier_id;
			if (!supplierId || map.has(supplierId)) continue;
			map.set(supplierId, {
				supplierId,
				name: quote.supplier_information?.suppliers_legal_name?.trim() || "—",
			});
		}
	}
	return Array.from(map.values());
}

function findQuoteForSupplier(
	quotations: PurchaseRequestProductQuotation[],
	supplierId: string,
): PurchaseRequestProductQuotation | undefined {
	return quotations.find(
		(quote) =>
			(quote.supplier_id || quote.supplier_information?.supplier_id) === supplierId,
	);
}

function pickRepresentativeQuote(
	products: PurchaseRequestProductInformation[],
	supplierId: string,
): PurchaseRequestProductQuotation | undefined {
	const all: PurchaseRequestProductQuotation[] = [];
	for (const product of products) {
		const quote = findQuoteForSupplier(product.quotations ?? [], supplierId);
		if (quote) all.push(quote);
	}
	if (all.length === 0) return undefined;
	return all.find((quote) => quote.is_accepted_for_purchase) ?? all[0];
}

function formatDelivery(quote: PurchaseRequestProductQuotation): string {
	if (quote.delivery_time == null) return "—";
	const type = formatTimeTypeLabel(quote.delivery_time_type);
	return `${quote.delivery_time} ${type}`.trim();
}

function formatWarranty(quote: PurchaseRequestProductQuotation): string {
	if (quote.warranty_period == null) return "—";
	const type = formatTimeTypeLabel(quote.warranty_period_time_type);
	return `${quote.warranty_period} ${type}`.trim();
}

function buildSelectedSuppliersAndJustification(
	products: PurchaseRequestProductInformation[],
): { selectedSupplierNames: string; justification: string } {
	const bySupplier = new Map<string, { name: string; justifications: string[] }>();

	for (const product of products) {
		for (const quote of product.quotations ?? []) {
			if (!quote.is_accepted_for_purchase) continue;
			const supplierId =
				quote.supplier_id || quote.supplier_information?.supplier_id || quote.quotation_id;
			const name = quote.supplier_information?.suppliers_legal_name?.trim() || "—";
			const justification = quote.supplier_selection_justification?.trim();
			const entry = bySupplier.get(supplierId) ?? { name, justifications: [] };
			if (justification && !entry.justifications.includes(justification)) {
				entry.justifications.push(justification);
			}
			bySupplier.set(supplierId, entry);
		}
	}

	const selected = Array.from(bySupplier.values());
	const selectedSupplierNames =
		selected.map((s) => s.name).filter(Boolean).join(", ") || "—";
	const justification =
		selected
			.map((s) => {
				const text = s.justifications.join(" ");
				return text ? `${s.name}: ${text}` : null;
			})
			.filter(Boolean)
			.join(". ") || "—";

	return { selectedSupplierNames, justification };
}

export function buildQuoteAnalysisPdfViewModel(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[],
): QuoteAnalysisPdfViewModel {
	const suppliers = collectUniqueSuppliers(products);
	const supplierIds = suppliers.map((s) => s.supplierId);
	const totals = emptyTotals(supplierIds);

	const items: QuoteAnalysisPdfItemRow[] = products.map((product) => {
		const quotations = product.quotations ?? [];
		const cellsBySupplierId: QuoteAnalysisPdfItemRow["cellsBySupplierId"] = {};

		for (const supplier of suppliers) {
			const quote = findQuoteForSupplier(quotations, supplier.supplierId);
			if (!quote) {
				cellsBySupplierId[supplier.supplierId] = null;
				continue;
			}

			const rawPrice = quote.price ?? 0;
			const rawIva = quote.iva ?? 0;
			const rawTotal = getQuoteTotalPrice(quote);

			totals.subtotal[supplier.supplierId] += rawPrice;
			totals.iva[supplier.supplierId] += rawIva;
			totals.total[supplier.supplierId] += rawTotal;

			cellsBySupplierId[supplier.supplierId] = {
				brand: quote.brand_product?.trim() || "—",
				unitPrice: formatCurrency(quote.price_unit ?? 0, "NIO"),
				iva: formatCurrency(rawIva, "NIO"),
				total: formatCurrency(rawTotal, "NIO"),
				rawPrice,
				rawIva,
				rawTotal,
			};
		}

		const unitMeasure =
			product.unit_measure_information?.name?.trim() ||
			product.unit_measure_information?.symbol?.trim() ||
			"—";

		const description =
			product.description?.trim() ||
			product.product_details?.product_name?.trim() ||
			"—";

		return {
			quantity: String(product.quantity ?? "—"),
			unitMeasure,
			description,
			cellsBySupplierId,
		};
	});

	const qualitative: QuoteAnalysisPdfQualitative = {
		delivery: {},
		transport: {},
		warranty: {},
	};

	for (const supplier of suppliers) {
		const quote = pickRepresentativeQuote(products, supplier.supplierId);
		qualitative.delivery[supplier.supplierId] = quote ? formatDelivery(quote) : "—";
		qualitative.transport[supplier.supplierId] = quote
			? quote.has_delivery
				? "Sí"
				: "No"
			: "—";
		qualitative.warranty[supplier.supplierId] = quote ? formatWarranty(quote) : "—";
	}

	const { selectedSupplierNames, justification } =
		buildSelectedSuppliersAndJustification(products);

	const elaboratedBy =
		detail.purchase_request?.creator_user_information?.fullname?.trim() ||
		detail.sent_by_user_information?.fullname?.trim() ||
		"—";

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

