import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type {
	ProductSupplierTierPrice,
	ProductSupplierTierPricePayload,
} from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export type CatalogLinkTierForm = {
	id: string;
	min_quantity: string;
	preferential_price: string;
	currency: CurrencyCode;
	valid_from: string;
	valid_to: string;
};

export type CatalogLinkItemForm = {
	entity_id: string;
	entity_label: string;
	unit_price: string;
	currency: CurrencyCode;
	unit_measure_id: string;
	tier_prices: CatalogLinkTierForm[];
};

export type CatalogLinkOption = {
	value: string;
	label: string;
};

export type CatalogLinkEditorProps = {
	title: string;
	emptyLabel: string;
	addButtonLabel: string;
	entityLabel: string;
	entityPlaceholder: string;
	options: CatalogLinkOption[];
	unitMeasureOptions?: CatalogLinkOption[];
	items: CatalogLinkItemForm[];
	onChange: (items: CatalogLinkItemForm[]) => void;
	isLoadingOptions?: boolean;
	isLoadingUnitMeasures?: boolean;
	disabled?: boolean;
	lockEntity?: boolean;
	onAddClick?: () => void;
};

export const emptyCatalogLinkTier = (
	currency: CurrencyCode = "USD",
): CatalogLinkTierForm => ({
	id: crypto.randomUUID(),
	min_quantity: "",
	preferential_price: "",
	currency,
	valid_from: new Date().toISOString().slice(0, 10),
	valid_to: "",
});

export const emptyCatalogLinkItem = (): CatalogLinkItemForm => ({
	entity_id: "",
	entity_label: "",
	unit_price: "",
	currency: "USD",
	unit_measure_id: "",
	tier_prices: [],
});

/** Empty string / whitespace → null so the API inherits the product UoM. */
export const resolveLinkUnitMeasureId = (
	raw?: string | null,
): string | null => {
	const trimmed = raw?.trim();
	return trimmed ? trimmed : null;
};

export const resolveLinkCurrency = (
	raw?: string | null,
): CurrencyCode => (raw === "NIO" ? "NIO" : "USD");

export const resolveLinkCurrencyPayload = (
	raw?: string | null,
): CurrencyCode => resolveLinkCurrency(raw);

const todayUtcDateOnly = (): string =>
	new Date().toISOString().slice(0, 10);

export const validatePreferentialDates = (
	validFrom: string,
	validTo?: string | null,
): string | null => {
	const from = validFrom.trim();
	if (!from) return "La fecha de inicio del preferencial es requerida.";

	const today = todayUtcDateOnly();
	if (from < today) {
		return "La fecha de inicio no puede ser un día pasado (UTC).";
	}

	const to = validTo?.trim();
	if (to && to < from) {
		return "La fecha de fin debe ser mayor o igual a la de inicio.";
	}

	return null;
};

/** Validates preferential dates on catalog link forms (create/update product|supplier). */
export const validateCatalogLinkPreferentialDates = (
	links: CatalogLinkItemForm[],
): string | null => {
	for (const link of links) {
		const tier = link.tier_prices[0];
		if (!tier) continue;
		const hasAnyField =
			tier.min_quantity.trim() ||
			tier.preferential_price.trim() ||
			tier.valid_from.trim() ||
			tier.valid_to.trim();
		if (!hasAnyField) continue;
		if (
			!tier.min_quantity.trim() ||
			!tier.preferential_price.trim() ||
			!tier.valid_from.trim()
		) {
			return `Complete el precio preferencial de "${link.entity_label || link.entity_id}" o quítelo.`;
		}
		const dateError = validatePreferentialDates(
			tier.valid_from,
			tier.valid_to,
		);
		if (dateError) {
			return `${dateError} (${link.entity_label || link.entity_id})`;
		}
	}
	return null;
};

export const mapCatalogLinkItemsToTierPayload = (
	tiers: CatalogLinkTierForm[],
	fallbackCurrency?: CurrencyCode | null,
): ProductSupplierTierPricePayload[] =>
	tiers
		.filter(
			(tier) =>
				tier.min_quantity.trim() !== "" &&
				tier.preferential_price.trim() !== "" &&
				tier.valid_from.trim() !== "",
		)
		.slice(0, 1)
		.map((tier) => ({
			min_quantity: Number(tier.min_quantity),
			preferential_price: Number(tier.preferential_price),
			currency: resolveLinkCurrency(tier.currency || fallbackCurrency),
			valid_from: tier.valid_from,
			valid_to: tier.valid_to.trim() ? tier.valid_to : null,
			unit_measure_id: null,
		}));

/**
 * PATCH semantics:
 * - preferentialTouched = false → omit (undefined)
 * - preferentialTouched = true + empty → []
 * - preferentialTouched = true + 1 item → [item]
 */
export const resolveTierPricesForPatch = (
	preferentialTouched: boolean,
	tiers: CatalogLinkTierForm[],
	fallbackCurrency?: CurrencyCode | null,
): ProductSupplierTierPricePayload[] | undefined => {
	if (!preferentialTouched) return undefined;
	return mapCatalogLinkItemsToTierPayload(tiers, fallbackCurrency);
};

export const mapTierPricesToCatalogForm = (
	tiers?: ProductSupplierTierPrice[] | null,
	fallbackCurrency?: CurrencyCode | null,
): CatalogLinkTierForm[] =>
	(tiers ?? []).slice(0, 1).map((tier) => ({
		id: tier.tier_price_id || crypto.randomUUID(),
		min_quantity: String(tier.min_quantity ?? ""),
		preferential_price: String(tier.preferential_price ?? ""),
		currency: resolveLinkCurrency(tier.currency ?? fallbackCurrency),
		valid_from: tier.valid_from?.slice(0, 10) ?? "",
		valid_to: tier.valid_to?.slice(0, 10) ?? "",
	}));
