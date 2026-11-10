import { Layers } from "lucide-react";
import type {
	PurchaseRequestProductQuotation,
	PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { TEXT_WRAP_CLASS } from "./comparison.constants";
import { findSupplierProductForQuote } from "./quote-product-comparison.utils";

type CatalogPriceRowProps = {
	quote: PurchaseRequestProductQuotation;
	supplierProducts?: PurchaseRequestSupplierProduct[];
};

export function CatalogPriceRow({
	quote,
	supplierProducts,
}: CatalogPriceRowProps) {
	const catalog = findSupplierProductForQuote(supplierProducts, quote);
	if (!catalog) return <span className="text-slate-400">—</span>;

	const tiersPreview =
		catalog.tier_prices
			?.slice(0, 2)
			.map(
				(tier) =>
					`≥${tier.min_quantity}: ${formatCurrency(tier.preferential_price, catalog.currency ?? "NIO")}`,
			)
			.join(" · ") ?? "";

	return (
		<div className="flex flex-col gap-0.5">
			<span>
				Precio Base:{" "}
				{catalog.unit_price == null
					? "—"
					: formatCurrency(catalog.unit_price, catalog.currency ?? "NIO")}
			</span>
			{tiersPreview ? (
				<span className="text-[11px] text-slate-500 dark:text-slate-400">
					{tiersPreview}
					{(catalog.tier_prices?.length ?? 0) > 2 ? "…" : ""}
				</span>
			) : null}
		</div>
	);
}

type SupplierCatalogPanelProps = {
	supplierProducts: PurchaseRequestSupplierProduct[];
};

export function SupplierCatalogPanel({
	supplierProducts,
}: SupplierCatalogPanelProps) {
	if (supplierProducts.length === 0) return null;

	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-[#232830] sm:p-4">
			<div className="mb-3 flex items-center gap-2">
				<Layers className="h-4 w-4 text-slate-500 dark:text-slate-400" />
				<h6 className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Catálogo proveedor (precio base)
				</h6>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{supplierProducts.map((product) => (
					<div
						key={product.supplier_product_id}
						className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700/50 dark:bg-[#1e2229]"
					>
						<p
							className={`m-0 text-sm font-semibold leading-snug text-slate-900 dark:text-white ${TEXT_WRAP_CLASS}`}
						>
							{product.suppliers_legal_name?.trim() ||
								product.commercial_name?.trim() ||
								"Proveedor"}
						</p>
						<p className="mt-1 m-0 text-xs text-slate-500 dark:text-slate-400">
							Precio base:{" "}
							<span className="font-medium text-slate-700 dark:text-slate-200">
								{product.unit_price == null
									? "—"
									: formatCurrency(
											product.unit_price,
											product.currency ?? "NIO",
										)}
							</span>
						</p>
						{(product.tier_prices?.length ?? 0) > 0 ? (
							<ul className="mt-2 m-0 list-none space-y-1 p-0">
								{product.tier_prices.map((tier) => (
									<li
										key={tier.tier_price_id}
										className="rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-[#272b34] dark:text-slate-300"
									>
										Desde {tier.min_quantity} und →{" "}
										{formatCurrency(
											tier.preferential_price,
											product.currency ?? "NIO",
										)}
										{tier.valid_from
											? ` · desde ${formatDateToSpanishWords(tier.valid_from)}`
											: ""}
										{tier.valid_to
											? ` · hasta ${formatDateToSpanishWords(tier.valid_to)}`
											: ""}
									</li>
								))}
							</ul>
						) : (
							<p className="mt-2 m-0 text-[11px] text-slate-400">
								Sin precios preferenciales
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
