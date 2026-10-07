import type { ProductSupplierTierPricePayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";

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
		}));
