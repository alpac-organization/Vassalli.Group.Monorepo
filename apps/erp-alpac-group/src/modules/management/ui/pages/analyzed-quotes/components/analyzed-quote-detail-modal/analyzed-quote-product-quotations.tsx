import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

type AnalyzedQuoteProductQuotationsProps = {
	quotations: PurchaseRequestProductQuotation[];
};

function getQuoteTotalPrice(quote: PurchaseRequestProductQuotation): number {
	return (quote.price ?? 0) + (quote.iva ?? 0);
}

function formatPeriodLabel(value: number | null, type: string | null): string | null {
	if (value == null) return null;
	const normalizedType = (type ?? "").toLowerCase();
	const unitMap: Record<string, [string, string]> = {
		day: ["día", "días"],
		days: ["día", "días"],
		week: ["semana", "semanas"],
		weeks: ["semana", "semanas"],
		month: ["mes", "meses"],
		months: ["mes", "meses"],
		year: ["año", "años"],
		years: ["año", "años"],
	};
	const [singular, plural] = unitMap[normalizedType] ?? ["", ""];
	if (!singular) return String(value);
	return `${value} ${value === 1 ? singular : plural}`;
}

function formatDelivery(quote: PurchaseRequestProductQuotation): string {
	if (!quote.has_delivery) return "No incluida";
	const period = formatPeriodLabel(quote.delivery_time, quote.delivery_time_type);
	return period ? `Incluida · ${period}` : "Incluida";
}

function formatWarranty(quote: PurchaseRequestProductQuotation): string {
	if (!quote.has_guarantee) return "No incluye";
	const period = formatPeriodLabel(quote.warranty_period, quote.warranty_period_time_type);
	return period ? `Incluye · ${period}` : "Incluye";
}

function QuoteField({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
	return (
		<div className="flex min-w-0 flex-col gap-0.5">
			<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
				{label}
			</span>
			<span
				className={`wrap-break-words text-sm ${
					emphasize
						? "font-semibold text-slate-800 dark:text-slate-100"
						: "text-slate-700 dark:text-slate-200"
				}`}
			>
				{value}
			</span>
		</div>
	);
}

export function AnalyzedQuoteProductQuotations({
	quotations,
}: AnalyzedQuoteProductQuotationsProps) {
	const activeQuotations = quotations.filter((quote) => quote.is_active);
	const selectedQuote = activeQuotations.find((quote) => quote.is_accepted_for_purchase);
	const selectedSupplier =
		selectedQuote?.supplier_information?.suppliers_legal_name?.trim();

	return (
		<div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40 sm:col-span-6">
			<div className="flex flex-wrap items-center gap-2">
				<p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Cotizaciones
				</p>
				{selectedSupplier ? (
					<span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
						Seleccionada: {selectedSupplier}
					</span>
				) : (
					<span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
						Sin oferta seleccionada
					</span>
				)}
			</div>

			{activeQuotations.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500 dark:border-neutral-700 dark:text-slate-400">
					No hay cotizaciones para este producto.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{activeQuotations.map((quote) => {
						const isSelected = quote.is_accepted_for_purchase;

						return (
							<div
								key={quote.quotation_id}
								className={`flex min-w-0 flex-col gap-3 rounded-lg border p-3 ${
									isSelected
										? "border-blue-500 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-500/10"
										: "border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
								}`}
							>
								<div className="flex min-w-0 items-start justify-between gap-2">
									<p className="m-0 min-w-0 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
										{quote.supplier_information?.suppliers_legal_name?.trim() ||
											"Proveedor"}
									</p>
									{isSelected ? (
										<span className="shrink-0 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-alpac-primary-700">
											Seleccionada
										</span>
									) : null}
								</div>

								<div className="grid grid-cols-2 gap-3">
									<QuoteField
										label="RUC / ID"
										value={
											quote.supplier_information?.identification_number?.trim() || "—"
										}
									/>
									<QuoteField
										label="Marca"
										value={quote.brand_product?.trim() || "—"}
									/>
									<QuoteField
										label="Precio unitario"
										value={formatCurrency(quote.price_unit ?? 0)}
									/>
									<QuoteField
										label="Precio"
										value={formatCurrency(quote.price ?? 0)}
									/>
									<QuoteField
										label="IVA"
										value={formatCurrency(quote.iva ?? 0)}
									/>
									<QuoteField
										label="Total"
										value={formatCurrency(getQuoteTotalPrice(quote))}
										emphasize
									/>
									<QuoteField label="Entrega" value={formatDelivery(quote)} />
									<QuoteField label="Garantía" value={formatWarranty(quote)} />
									<QuoteField
										label="Fecha de cotización"
										value={
											quote.quote_date
												? formatDateToSpanishWords(quote.quote_date)
												: "—"
										}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
