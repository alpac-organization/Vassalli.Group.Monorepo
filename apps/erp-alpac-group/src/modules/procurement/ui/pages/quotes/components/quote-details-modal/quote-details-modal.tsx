import { Badges, Modal } from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";
import type { QuoteDetailsModalProps } from "@app/modules/procurement/ui/pages/quotes/components/quote-details-modal/quote-details-modal.types";

const formatQuoteDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value || "—";

  return new Intl.DateTimeFormat("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

function QuoteDetailsContent({ quote }: { quote: GetHistoryQuotesView }) {
  const quotesMade = quote.additional_data?.quotes_made ?? [];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Responsable
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {quote.made_by || "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Fecha
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {formatQuoteDate(quote.quote_date)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Costo aproximado
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(
              quote.approximate_cost ?? 0,
              quote.currency ?? "NIO",
            ) ?? "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Proveedores cotizados
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {quotesMade.length}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
          Observaciones
        </p>
        <p className="mt-1 wrap-break-word text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
          {quote.observations?.trim() || "Sin observaciones"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="m-0! p-0! text-base font-semibold text-slate-900 dark:text-white">
          Cotizaciones por proveedor
        </h4>

        {quotesMade.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay proveedores asociados a esta cotización.
          </p>
        ) : (
          quotesMade.map((entry, index) => {
            const supplier = entry.suppliers_details;
            const products = entry.product_details_quotes ?? [];

            return (
              <div
                key={`${supplier.supplier_legal_name}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="wrap-break-word text-[15px] font-semibold text-slate-900 dark:text-white">
                      {supplier.supplier_legal_name}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                      Contacto: {supplier.contact_name || "—"} ·{" "}
                      {supplier.contact_phone_number || "—"}
                    </p>
                  </div>
                  <Badges
                    label={
                      supplier.its_registered ? "Registrado" : "No registrado"
                    }
                    color={
                      supplier.its_registered
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                    }
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Productos
                  </p>
                  {products.map((product, productIndex) => (
                    <div
                      key={`${product.product_name}-${productIndex}`}
                      className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                          {product.product_name}
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 dark:text-white">
                          {formatCurrency(
                            product.product_cost ?? 0,
                            quote.currency ?? "NIO",
                          ) ?? "—"}
                        </p>
                      </div>
                      <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                        {product.product_id
                          ? `ID: ${product.product_id} · `
                          : ""}
                        Unidad: {product.unit_measure_id || "—"}
                      </p>
                      {product.observations?.trim() && (
                        <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-300">
                          {product.observations}
                        </p>
                      )}
                      {product.images_base_64 &&
                        product.images_base_64.length > 0 && (
                          <ImagePreviewGallery
                            title="Imágenes del producto"
                            images={product.images_base_64.map((image) => ({
                              image_base64: image,
                            }))}
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function QuoteDetailsModal({
  isOpen,
  onClose,
  quote,
}: QuoteDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="info"
      size="3xl"
      title="Detalle de cotización"
      description={
        quote
          ? `Registro elaborado por ${quote.made_by}`
          : "Información completa del registro seleccionado"
      }
      panelClassName={[
        "w-[min(calc(100vw-1rem),48rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      {quote ? (
        <QuoteDetailsContent quote={quote} />
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay una cotización seleccionada.
        </p>
      )}
    </Modal>
  );
}
