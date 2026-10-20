import { Button } from "@alpac/design-system";
import type { LucideIcon } from "lucide-react";
import {
	Calendar,
	Hash,
	Clock,
	NotebookText,
	Package,
	Percent,
	ShieldCheck,
	Tag,
	Award,
	Truck,
	User,
	Layers,
} from "lucide-react";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type {
	PurchaseRequestProductQuotation,
	PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { QuoteProductComparisonProps } from "./quote-product-comparison.types";
import {
	chunkQuotations,
	findSupplierProductForQuote,
	getBestPriceQuotationId,
	getQuoteIvaPercentage,
	getQuoteSubtotal,
	getQuoteTotalPrice,
} from "./quote-product-comparison.utils";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import { formatTimeTypeLabel } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/utils/format-type-label";

const MAX_COLUMNS = 3;

type ComparisonRow = {
	key: string;
	label: string;
	icon: LucideIcon;
	getValue: (quote: PurchaseRequestProductQuotation) => string;
	emphasize?: boolean;
};

const COMPARISON_ROWS: ComparisonRow[] = [
	{
		key: "ruc",
		label: "RUC / ID",
		icon: Hash,
		getValue: (quote) =>
			quote.supplier_information?.identification_number?.trim() || "—",
	},
	{
		key: "provider",
		label: "Proveedor",
		icon: User,
		getValue: (quote) =>
			quote.supplier_information?.suppliers_legal_name?.trim() || "—",
	},
	{
		key: "justification",
		label: "Justificación",
		icon: NotebookText,
		getValue: (quote) => quote.supplier_selection_justification?.trim() || "—",
	},
	{
		key: "brand",
		label: "Marca / producto",
		icon: Tag,
		getValue: (quote) => quote.brand_product?.trim() || "—",
	},
	{
		key: "unit_price",
		label: "Precio unitario",
		icon: Package,
		getValue: (quote) => formatCurrency(quote.price_unit ?? 0),
	},
	{
		key: "subtotal",
		label: "Subtotal",
		icon: Package,
		getValue: (quote) => formatCurrency(getQuoteSubtotal(quote)),
	},
	{
		key: "iva",
		label: "IVA",
		icon: Package,
		getValue: (quote) => formatCurrency(quote.iva ?? 0),
	},
	{
		key: "iva_percent",
		label: "IVA (%)",
		icon: Percent,
		getValue: (quote) => {
			const percent = getQuoteIvaPercentage(quote);
			return percent == null ? "—" : `${percent.toFixed(2)}%`;
		},
	},
	{
		key: "total",
		label: "Precio total",
		icon: Package,
		getValue: (quote) => formatCurrency(getQuoteTotalPrice(quote)),
		emphasize: true,
	},
	{
		key: "delivery_time_type",
		label: "Tipo de entrega",
		icon: Truck,
		getValue: (quote) => formatTimeTypeLabel(quote.delivery_time_type),
	},
	{
		key: "delivery_time",
		label: "Tiempo de entrega",
		icon: Clock,
		getValue: (quote) =>
			quote.delivery_time == null ? "—" : String(quote.delivery_time),
	},
	{
		key: "warranty_period",
		label: "Período de garantía",
		icon: ShieldCheck,
		getValue: (quote) =>
			quote.warranty_period == null ? "—" : String(quote.warranty_period),
	},
	{
		key: "warranty_period_time_type",
		label: "Tipo de garantía",
		icon: Award,
		getValue: (quote) => formatTimeTypeLabel(quote.warranty_period_time_type),
	},
	{
		key: "date",
		label: "Fecha de cotización",
		icon: Calendar,
		getValue: (quote) =>
			quote.quote_date ? formatDateToSpanishWords(quote.quote_date) : "—",
	},
];

function getGridTemplate(): string {
	return `minmax(140px, 180px) repeat(${MAX_COLUMNS}, minmax(0, 1fr))`;
}

function EmptyQuoteCells({ count }: { count: number }) {
	if (count <= 0) return null;
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={`empty-${index}`}
					className="border-0 bg-transparent"
					aria-hidden
				/>
			))}
		</>
	);
}

function RecommendationBadges({
	isBestPrice,
	isBestWarranty,
	isBestDelivery,
	isBestOption,
}: {
	isBestPrice: boolean;
	isBestWarranty: boolean;
	isBestDelivery: boolean;
	isBestOption: boolean;
}) {
	const badges: { key: string; label: string; className: string }[] = [];

	if (isBestPrice) {
		badges.push({
			key: "price",
			label: "Mejor precio",
			className:
				"bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
		});
	}
	if (isBestWarranty) {
		badges.push({
			key: "warranty",
			label: "Mejor garantía",
			className:
				"bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
		});
	}
	if (isBestDelivery) {
		badges.push({
			key: "delivery",
			label: "Mejor entrega",
			className:
				"bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
		});
	}
	if (isBestOption) {
		badges.push({
			key: "option",
			label: "Mejor opción",
			className:
				"bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
		});
	}

	if (badges.length === 0) return null;

	return (
		<div className="flex flex-wrap justify-end gap-1">
			{badges.map((badge) => (
				<span
					key={badge.key}
					className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}
				>
					{badge.label}
				</span>
			))}
		</div>
	);
}

function SupplierCatalogPanel({
	supplierProducts,
}: {
	supplierProducts: PurchaseRequestSupplierProduct[];
}) {
	if (supplierProducts.length === 0) return null;

	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-[#232830] sm:p-4">
			<div className="mb-3 flex items-center gap-2">
				<Layers className="h-4 w-4 text-slate-500 dark:text-slate-400" />
				<h6 className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Catálogo proveedor (precio base + tiers)
				</h6>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{supplierProducts.map((product) => (
					<div
						key={product.supplier_product_id}
						className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700/50 dark:bg-[#1e2229]"
					>
						<p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
							{product.suppliers_legal_name?.trim() ||
								product.commercial_name?.trim() ||
								"Proveedor"}
						</p>
						<p className="mt-1 m-0 text-xs text-slate-500 dark:text-slate-400">
							Precio base:{" "}
							<span className="font-medium text-slate-700 dark:text-slate-200">
								{product.unit_price == null
									? "—"
									: formatCurrency(product.unit_price, product.currency ?? "NIO")}
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
										{formatCurrency(tier.preferential_price, product.currency ?? "NIO")}
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

function CatalogPriceRow({
	quote,
	supplierProducts,
}: {
	quote: PurchaseRequestProductQuotation;
	supplierProducts?: PurchaseRequestSupplierProduct[];
}) {
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
				Base:{" "}
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

function QuoteAcceptButton({
	isSelected,
	isAccepting,
	onAccept,
	accountingReviewStatus,
}: {
	isSelected: boolean;
	isAccepting?: boolean;
	onAccept: () => void;
	accountingReviewStatus: accountingReviewStatusType;
}) {
	if (isSelected) {
		return (
			<Button
				type="button"
				size="small"
				label="Oferta seleccionada"
				disabled
				className="w-full! rounded-md! border! border-blue-500! bg-blue-600! dark:bg-alpac-primary-700! text-[13px]! text-white! opacity-100!"
			/>
		);
	}

	if (accountingReviewStatus !== "Pending") return null;

	return (
		<Button
			type="button"
			size="small"
			label="Aceptar esta oferta"
			onClick={onAccept}
			disabled={isAccepting}
			className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
		/>
	);
}

function QuoteCard({
	quote,
	isSelected,
	isBestPrice,
	isBestWarranty,
	isBestDelivery,
	isAccepting,
	onAccept,
	accountingReviewStatus,
	supplierProducts,
}: {
	quote: PurchaseRequestProductQuotation;
	isSelected: boolean;
	isBestPrice: boolean;
	isBestWarranty: boolean;
	isBestDelivery: boolean;
	isAccepting?: boolean;
	onAccept: () => void;
	accountingReviewStatus: accountingReviewStatusType;
	supplierProducts?: PurchaseRequestSupplierProduct[];
}) {
	return (
		<div
			className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4 ${
				isSelected
					? "border-blue-500 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-500/10"
					: "border-slate-200 bg-white dark:border-slate-700/60 dark:bg-[#1e2229]"
			}`}
		>
			<div className="flex min-w-0 flex-col gap-2">
				<div className="flex min-w-0 items-start justify-between gap-2">
					<p className="m-0 min-w-0 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
						{quote.supplier_information?.suppliers_legal_name?.trim() ||
							"Proveedor"}
					</p>
					<RecommendationBadges
						isBestPrice={isBestPrice}
						isBestWarranty={isBestWarranty}
						isBestDelivery={isBestDelivery}
						isBestOption={Boolean(quote.is_best_option)}
					/>
				</div>
				<QuoteAcceptButton
					isSelected={isSelected}
					isAccepting={isAccepting}
					onAccept={onAccept}
					accountingReviewStatus={accountingReviewStatus}
				/>
			</div>

			<div className="flex flex-col">
				<div className="flex items-start justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-2 dark:bg-[#232830]">
					<span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
						<Layers className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">Catálogo</span>
					</span>
					<span className="max-w-[58%] wrap-break-words text-right text-sm text-slate-700 dark:text-slate-200">
						<CatalogPriceRow
							quote={quote}
							supplierProducts={supplierProducts}
						/>
					</span>
				</div>
				{COMPARISON_ROWS.map((row, rowIndex) => {
					const Icon = row.icon;
					const zebra =
						rowIndex % 2 === 0 ? "bg-transparent" : "bg-slate-50 dark:bg-[#232830]";

					return (
						<div
							key={row.key}
							className={`flex items-start justify-between gap-3 rounded-md px-2.5 py-2 ${zebra}`}
						>
							<span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
								<Icon className="h-3.5 w-3.5 shrink-0" />
								<span className="truncate">{row.label}</span>
							</span>
							<span
								className={`max-w-[58%] wrap-break-words text-right text-sm ${
									row.emphasize
										? "font-semibold text-slate-900 dark:text-white"
										: "text-slate-700 dark:text-slate-200"
								}`}
							>
								{row.getValue(quote)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function QuoteProductComparison({
	itemId,
	quotations,
	recommendations,
	supplierProducts,
	selectedQuotationId,
	onRequestAccept,
	isAccepting,
	accountingReviewStatus,
}: QuoteProductComparisonProps) {
	const activeQuotations = quotations.filter((quote) => quote.is_active);
	const bestPriceId = getBestPriceQuotationId(activeQuotations);
	const bestWarrantyId = recommendations?.best_warranty_quotation_id ?? null;
	const bestDeliveryId = recommendations?.best_delivery_quotation_id ?? null;
	const chunks = chunkQuotations(activeQuotations, MAX_COLUMNS);
	const catalogProducts = supplierProducts ?? [];

	if (activeQuotations.length === 0) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-600 dark:bg-[#272b34] dark:text-slate-400">
				No hay cotizaciones disponibles para este producto.
			</div>
		);
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			<SupplierCatalogPanel supplierProducts={catalogProducts} />

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
				{activeQuotations.map((quote) => {
					const isSelected =
						selectedQuotationId === quote.quotation_id ||
						quote.is_accepted_for_purchase;

					return (
						<QuoteCard
							key={quote.quotation_id}
							quote={quote}
							accountingReviewStatus={accountingReviewStatus}
							isSelected={isSelected}
							isBestPrice={bestPriceId === quote.quotation_id}
							isBestWarranty={bestWarrantyId === quote.quotation_id}
							isBestDelivery={bestDeliveryId === quote.quotation_id}
							isAccepting={isAccepting}
							supplierProducts={catalogProducts}
							onAccept={() => onRequestAccept(itemId, quote)}
						/>
					);
				})}
			</div>

			<div className="hidden flex-col gap-4 lg:flex">
				{chunks.map((chunk, chunkIndex) => {
					const emptyCount = MAX_COLUMNS - chunk.length;

					return (
						<div
							key={`chunk-${chunkIndex}`}
							className="w-full min-w-0 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/60"
						>
							<div
								className="min-w-170"
								style={{
									display: "grid",
									gridTemplateColumns: getGridTemplate(),
								}}
							>
								<div className="flex items-center bg-slate-50 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-[#232830] dark:text-slate-400 xl:px-4">
									Cotización
								</div>
								{chunk.map((quote, quoteIndex) => {
									const isSelected =
										selectedQuotationId === quote.quotation_id ||
										quote.is_accepted_for_purchase;
									const isLastFilled = quoteIndex === chunk.length - 1;

									return (
										<div
											key={quote.quotation_id}
											className={`flex flex-col gap-3 border-l border-slate-200 px-3 py-3 dark:border-slate-700/60 xl:px-4 ${
												isLastFilled
													? "border-r border-slate-200 dark:border-slate-700/60"
													: ""
											} ${
												isSelected
													? "bg-blue-50/60 dark:bg-blue-500/10"
													: "bg-white dark:bg-[#1e2229]"
											}`}
										>
											<div className="flex min-w-0 flex-col gap-2">
												<div className="flex min-w-0 items-start justify-between gap-2">
													<p className="m-0 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
														{quote.supplier_information?.suppliers_legal_name?.trim() ||
															"Proveedor"}
													</p>
													<RecommendationBadges
														isBestPrice={bestPriceId === quote.quotation_id}
														isBestWarranty={
															bestWarrantyId === quote.quotation_id
														}
														isBestDelivery={
															bestDeliveryId === quote.quotation_id
														}
														isBestOption={Boolean(quote.is_best_option)}
													/>
												</div>
												<QuoteAcceptButton
													isSelected={isSelected}
													isAccepting={isAccepting}
													accountingReviewStatus={accountingReviewStatus}
													onAccept={() => onRequestAccept(itemId, quote)}
												/>
											</div>
										</div>
									);
								})}
								<EmptyQuoteCells count={emptyCount} />

								<div className="contents">
									<div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-500 dark:border-slate-700/60 dark:bg-[#1e2229] dark:text-slate-400 xl:px-4">
										<Layers className="h-3.5 w-3.5 shrink-0" />
										<span className="leading-snug">Catálogo</span>
									</div>
									{chunk.map((quote, quoteIndex) => {
										const isSelected =
											selectedQuotationId === quote.quotation_id ||
											quote.is_accepted_for_purchase;
										const isLastFilled = quoteIndex === chunk.length - 1;
										return (
											<div
												key={`${quote.quotation_id}-catalog`}
												className={`border-t border-l border-slate-200 px-3 py-2.5 text-sm wrap-break-words text-slate-700 dark:border-slate-700/60 dark:text-slate-200 xl:px-4 ${
													isLastFilled
														? "border-r border-slate-200 dark:border-slate-700/60"
														: ""
												} ${
													isSelected
														? "bg-blue-50/40 dark:bg-blue-500/5"
														: "bg-white dark:bg-[#1e2229]"
												}`}
											>
												<CatalogPriceRow
													quote={quote}
													supplierProducts={catalogProducts}
												/>
											</div>
										);
									})}
									<EmptyQuoteCells count={emptyCount} />
								</div>

								{COMPARISON_ROWS.map((row, rowIndex) => {
									const Icon = row.icon;
									const zebra =
										rowIndex % 2 === 0
											? "bg-slate-50 dark:bg-[#232830]"
											: "bg-white dark:bg-[#1e2229]";

									return (
										<div key={`${chunkIndex}-${row.key}`} className="contents">
											<div
												className={`flex items-center gap-2 border-t border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-500 dark:border-slate-700/60 dark:text-slate-400 xl:px-4 ${zebra}`}
											>
												<Icon className="h-3.5 w-3.5 shrink-0" />
												<span className="leading-snug">{row.label}</span>
											</div>
											{chunk.map((quote, quoteIndex) => {
												const isSelected =
													selectedQuotationId === quote.quotation_id ||
													quote.is_accepted_for_purchase;
												const isLastFilled = quoteIndex === chunk.length - 1;
												return (
													<div
														key={`${quote.quotation_id}-${row.key}`}
														className={`border-t border-l border-slate-200 px-3 py-2.5 text-sm wrap-break-words dark:border-slate-700/60 xl:px-4 ${
															isLastFilled
																? "border-r border-slate-200 dark:border-slate-700/60"
																: ""
														} ${zebra} ${
															isSelected
																? "bg-blue-50/40 dark:bg-blue-500/5"
																: ""
														} ${
															row.emphasize
																? "font-semibold text-slate-900 dark:text-white"
																: "text-slate-700 dark:text-slate-200"
														}`}
													>
														{row.getValue(quote)}
													</div>
												);
											})}
											<EmptyQuoteCells count={emptyCount} />
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
