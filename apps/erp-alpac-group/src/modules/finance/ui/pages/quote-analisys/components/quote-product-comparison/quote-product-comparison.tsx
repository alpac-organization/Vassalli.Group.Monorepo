import { Button } from "@alpac/design-system";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Hash,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { QuoteProductComparisonProps } from "./quote-product-comparison.types";
import {
  chunkQuotations,
  formatPeriodLabel,
  getBestPriceQuotationId,
} from "./quote-product-comparison.utils";

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
    key: "provider",
    label: "Proveedor",
    icon: User,
    getValue: (quote) =>
      quote.supplier_information?.suppliers_legal_name?.trim() || "—",
  },
  {
    key: "ruc",
    label: "RUC / ID",
    icon: Hash,
    getValue: (quote) =>
      quote.supplier_information?.identification_number?.trim() || "—",
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
    key: "price",
    label: "Precio",
    icon: Package,
    getValue: (quote) => formatCurrency(quote.price ?? 0),
  },
  {
    key: "iva",
    label: "IVA",
    icon: Package,
    getValue: (quote) => `${Number(quote.iva ?? 0).toFixed(2)}%`,
  },
  {
    key: "total",
    label: "Precio total",
    icon: Package,
    getValue: (quote) => formatCurrency(quote.price_total ?? 0),
    emphasize: true,
  },
  {
    key: "delivery",
    label: "Entrega",
    icon: Truck,
    getValue: (quote) => {
      if (!quote.has_delivery) return "No incluida";
      const period = formatPeriodLabel(
        quote.delivery_time,
        quote.delivery_time_type,
      );
      return period ? `Incluida · ${period}` : "Incluida";
    },
  },
  {
    key: "warranty",
    label: "Garantía",
    icon: ShieldCheck,
    getValue: (quote) => {
      if (!quote.has_guarantee) return "No incluye";
      const period = formatPeriodLabel(
        quote.warranty_period,
        quote.warranty_period_time_type,
      );
      return period ? `Incluye · ${period}` : "Incluye";
    },
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

function QuoteCard({
  quote,
  isSelected,
  isBestPrice,
  onSelect,
  onDeselect,
}: {
  quote: PurchaseRequestProductQuotation;
  isSelected: boolean;
  isBestPrice: boolean;
  onSelect: () => void;
  onDeselect: () => void;
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
          <p className="m-0 min-w-0 break-words text-sm font-semibold text-slate-900 dark:text-white">
            {quote.supplier_information?.suppliers_legal_name?.trim() ||
              "Proveedor"}
          </p>
          {isBestPrice && (
            <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              Mejor precio
            </span>
          )}
        </div>
        {isSelected ? (
          <div className="flex w-full flex-col gap-2">
            <Button
              type="button"
              size="small"
              label="Oferta seleccionada"
              disabled
              className="w-full! rounded-md! border! border-blue-500! bg-blue-600! text-[13px]! text-white! opacity-100!"
            />
            <Button
              type="button"
              size="small"
              label="Desmarcar oferta"
              onClick={onDeselect}
              className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
            />
          </div>
        ) : (
          <Button
            type="button"
            size="small"
            label="Aceptar esta oferta"
            onClick={onSelect}
            className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
          />
        )}
      </div>

      <div className="flex flex-col">
        {COMPARISON_ROWS.map((row, rowIndex) => {
          const Icon = row.icon;
          const zebra =
            rowIndex % 2 === 0
              ? "bg-slate-50 dark:bg-[#232830]"
              : "bg-transparent";

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
                className={`max-w-[58%] break-words text-right text-sm ${
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
  selectedQuotationId,
  onSelectQuotation,
  onDeselectQuotation,
}: QuoteProductComparisonProps) {
  const activeQuotations = quotations.filter((quote) => quote.is_active);
  const bestPriceId = getBestPriceQuotationId(activeQuotations);
  const chunks = chunkQuotations(activeQuotations, MAX_COLUMNS);

  if (activeQuotations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-600 dark:bg-[#272b34] dark:text-slate-400">
        No hay cotizaciones disponibles para este producto.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {activeQuotations.map((quote) => (
          <QuoteCard
            key={quote.quotation_id}
            quote={quote}
            isSelected={selectedQuotationId === quote.quotation_id}
            isBestPrice={bestPriceId === quote.quotation_id}
            onSelect={() => onSelectQuotation(itemId, quote.quotation_id)}
            onDeselect={() => onDeselectQuotation(itemId)}
          />
        ))}
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
                className="min-w-[680px]"
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridTemplate(),
                }}
              >
                <div className="flex items-center bg-slate-50 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-[#232830] dark:text-slate-400 xl:px-4">
                  Cotización
                </div>
                {chunk.map((quote, quoteIndex) => {
                  const isSelected = selectedQuotationId === quote.quotation_id;
                  const isBestPrice = bestPriceId === quote.quotation_id;
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
                          {isBestPrice && (
                            <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                              Mejor precio
                            </span>
                          )}
                        </div>
                        {isSelected ? (
                          <div className="flex w-full flex-col gap-2">
                            <Button
                              type="button"
                              size="small"
                              label="Oferta seleccionada"
                              disabled
                              className="w-full! rounded-md! border! border-blue-500! dark:bg-alpac-primary-700! text-[13px]! text-white! opacity-100!"
                            />
                            <Button
                              type="button"
                              size="small"
                              label="Desmarcar oferta"
                              onClick={() => onDeselectQuotation(itemId)}
                              className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
                            />
                          </div>
                        ) : (
                          <Button
                            type="button"
                            size="small"
                            label="Aceptar esta oferta"
                            onClick={() =>
                              onSelectQuotation(itemId, quote.quotation_id)
                            }
                            className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                <EmptyQuoteCells count={emptyCount} />

                {COMPARISON_ROWS.map((row, rowIndex) => {
                  const Icon = row.icon;
                  const zebra =
                    rowIndex % 2 === 0
                      ? "bg-white dark:bg-[#1e2229]"
                      : "bg-slate-50 dark:bg-[#232830]";

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
                          selectedQuotationId === quote.quotation_id;
                        const isLastFilled = quoteIndex === chunk.length - 1;
                        return (
                          <div
                            key={`${quote.quotation_id}-${row.key}`}
                            className={`border-t border-l border-slate-200 px-3 py-2.5 text-sm break-words dark:border-slate-700/60 xl:px-4 ${
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
