import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { resolvePaymentMethodLabel } from "@app/shared/utils/quotation-label.utils";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { Button } from "@alpac/design-system";
import type { PurchaseRequestProductsTableProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-products-table/purchase-request-products-table.types";
import { getQuoteTotalPrice } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";

type AnalyzedQuoteProductQuotationsProps = {
	quotations: PurchaseRequestProductQuotation[];
	onGenerateDocument?: PurchaseRequestProductsTableProps["onGenerateDocument"];
};

function formatPeriodLabel(
	value: number | null,
	type: string | null,
): string | null {
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
	const period = formatPeriodLabel(
		quote.delivery_time,
		quote.delivery_time_type,
	);
	return period ? `Incluida · ${period}` : "Incluida";
}

function formatWarranty(quote: PurchaseRequestProductQuotation): string {
	if (!quote.has_guarantee) return "No incluye";
	const period = formatPeriodLabel(
		quote.warranty_period,
		quote.warranty_period_time_type,
	);
	return period ? `Incluye · ${period}` : "Incluye";
}

function QuoteField({
	label,
	value,
	emphasize,
}: {
	label: string;
	value: string;
	emphasize?: boolean;
}) {
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

function resolveSelectedQuote(
	quotations: PurchaseRequestProductQuotation[],
): PurchaseRequestProductQuotation | null {
	const accepted = quotations.find(
		(quote) => quote.is_accepted_for_purchase && quote.is_active !== false,
	);
	if (accepted) return accepted;

	const active = quotations.find((quote) => quote.is_active !== false);
	return active ?? quotations[0] ?? null;
}

export function AnalyzedQuoteProductQuotations({
	quotations,
	onGenerateDocument,
}: AnalyzedQuoteProductQuotationsProps) {
	const selectedQuote = resolveSelectedQuote(quotations);
	const supplierName =
		selectedQuote?.supplier_information?.suppliers_legal_name?.trim() || null;
	const selectionJustification =
		selectedQuote?.supplier_selection_justification?.trim() || null;
	const rawPaymentMethod =
		selectedQuote?.payment_method_type ??
		(typeof selectedQuote?.payment_method === "string"
			? selectedQuote.payment_method
			: null);
	const paymentMethodLabel = resolvePaymentMethodLabel(rawPaymentMethod);

	return (
		<div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40 sm:col-span-6">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
						Cotización seleccionada
					</p>
					{supplierName ? (
						<span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
							{supplierName}
						</span>
					) : (
						<span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
							Sin oferta seleccionada
						</span>
					)}
				</div>
				{onGenerateDocument ? (
					<Button
						type="button"
						size="medium"
						label="Generar documento"
						onClick={() => onGenerateDocument?.()}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-64!"
					/>
				) : null}
			</div>

			{!selectedQuote ? (
				<div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500 dark:border-neutral-700 dark:text-slate-400">
					No hay cotización aceptada para este producto.
				</div>
			) : (
				<>
					<div className="flex min-w-0 flex-col gap-3 rounded-lg border border-blue-500 bg-blue-50/70 p-3 dark:border-blue-500 dark:bg-blue-500/10">
						<div className="flex min-w-0 items-start justify-between gap-2">
							<p className="m-0 min-w-0 wrap-break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
								{supplierName || "Proveedor"}
							</p>
							<span className="shrink-0 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-alpac-primary-700">
								Aceptada
							</span>
						</div>

						<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
							<QuoteField
								label="RUC / ID"
								value={
									selectedQuote.supplier_information?.identification_number?.trim() ||
									"—"
								}
							/>
							<QuoteField
								label="Marca"
								value={selectedQuote.brand_product?.trim() || "—"}
							/>
							<QuoteField
								label="Método de pago"
								value={paymentMethodLabel}
							/>
							<QuoteField
								label="Precio unitario"
								value={formatCurrency(selectedQuote.price_unit ?? 0)}
							/>
							<QuoteField
								label="Subtotal"
								value={formatCurrency(
									selectedQuote.price_total != null &&
										selectedQuote.price_total > 0
										? selectedQuote.price_total
										: (selectedQuote.price ?? 0),
								)}
							/>
							<QuoteField
								label="IVA"
								value={formatCurrency(selectedQuote.iva ?? 0)}
							/>
							<QuoteField
								label="Total"
								value={formatCurrency(getQuoteTotalPrice(selectedQuote))}
								emphasize
							/>
							<QuoteField
								label="Entrega"
								value={formatDelivery(selectedQuote)}
							/>
							<QuoteField
								label="Garantía"
								value={formatWarranty(selectedQuote)}
							/>
							<QuoteField
								label="Inventario"
								value={
									selectedQuote.inventory_available !== false
										? "Disponible"
										: "No disponible"
								}
							/>
							<QuoteField
								label="Fecha de cotización"
								value={
									selectedQuote.quote_date
										? formatDateToSpanishWords(selectedQuote.quote_date)
										: "—"
								}
							/>
						</div>
					</div>

					<div className="wrap-break-words rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300">
						<span className="font-semibold text-slate-800 dark:text-slate-200">
							Justificación de selección:{" "}
						</span>
						{selectionJustification || "—"}
					</div>
				</>
			)}
		</div>
	);
}
