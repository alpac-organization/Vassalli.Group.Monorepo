import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type {
	ProductSupplierTierPrice,
	ProductSupplierTierPricePayload,
} from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export type CatalogLinkTierForm = {
	id: string;
	min_quantity: string;
	preferential_price: string;
	valid_from: string;
	valid_to: string;
};

export type CatalogLinkItemForm = {
	entity_id: string;
	entity_label: string;
	unit_price: string;
	currency: CurrencyCode;
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
	items: CatalogLinkItemForm[];
	onChange: (items: CatalogLinkItemForm[]) => void;
	isLoadingOptions?: boolean;
	disabled?: boolean;
	lockEntity?: boolean;
	onAddClick?: () => void;
};

export const emptyCatalogLinkTier = (): CatalogLinkTierForm => ({
	id: crypto.randomUUID(),
	min_quantity: "",
	preferential_price: "",
	valid_from: new Date().toISOString().slice(0, 10),
	valid_to: "",
});

export const emptyCatalogLinkItem = (): CatalogLinkItemForm => ({
	entity_id: "",
	entity_label: "",
	unit_price: "",
	currency: "USD",
	tier_prices: [],
});

export const mapCatalogLinkItemsToTierPayload = (
	tiers: CatalogLinkTierForm[],
): ProductSupplierTierPricePayload[] =>
	tiers
		.filter(
			(tier) =>
				tier.min_quantity.trim() !== "" &&
				tier.preferential_price.trim() !== "" &&
				tier.valid_from.trim() !== "",
		)
		.map((tier) => ({
			min_quantity: Number(tier.min_quantity),
			preferential_price: Number(tier.preferential_price),
			valid_from: tier.valid_from,
			valid_to: tier.valid_to.trim() ? tier.valid_to : null,
			unit_measure_id: null,
		}));

export const mapTierPricesToCatalogForm = (
	tiers?: ProductSupplierTierPrice[] | null,
): CatalogLinkTierForm[] =>
	(tiers ?? []).map((tier) => ({
		id: tier.tier_price_id || crypto.randomUUID(),
		min_quantity: String(tier.min_quantity ?? ""),
		preferential_price: String(tier.preferential_price ?? ""),
		valid_from: tier.valid_from?.slice(0, 10) ?? "",
		valid_to: tier.valid_to?.slice(0, 10) ?? "",
	}));

export const resolveLinkCurrency = (
	raw?: string | null,
): CurrencyCode => (raw === "NIO" ? "NIO" : "USD");
