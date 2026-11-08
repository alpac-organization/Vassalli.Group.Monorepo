import { AccordionItem, Checkbox } from "@alpac/design-system";
import {
  CircleCheckBigIcon,
  CircleXIcon,
  HashIcon,
  LayersIcon,
  NotebookTextIcon,
  PackageIcon,
  RulerIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";

const productNameLabelClassName =
  "block min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white";
const indexBadgeClassName =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700";

export function QuoteDetailAccordion({
  quoteDetailIndex,
  accordionValue,
  requestedProduct,
  isSelected = false,
  assignedSuppliersCount = 0,
  onSelectedChange,
}: QuoteDetailAccordionProps) {
  const productName =
    requestedProduct?.product_details?.product_name?.trim() || "Nuevo producto";

  const categoryName =
    requestedProduct?.product_details?.category_information?.name?.trim() ||
    null;

  const hasQuotation =
    (requestedProduct?.has_quotation ?? false) || assignedSuppliersCount > 0;

  const quantity = requestedProduct?.quantity;
  const quantityUnit = requestedProduct?.quantity_unit;
  const quantityLabel =
    quantity == null
      ? null
      : quantityUnit != null
        ? `${quantity} × ${quantityUnit}`
        : String(quantity);

  const unitMeasure =
    requestedProduct?.unit_measure_information?.name?.trim() ||
    requestedProduct?.unit_measure_information?.symbol?.trim() ||
    requestedProduct?.unit_measure_information?.code?.trim() ||
    null;

  const justification = requestedProduct?.justification?.trim() || null;

  const quotationStatusColor = hasQuotation
    ? "text-[#22c55e]"
    : "text-slate-500 dark:text-slate-300";

  return (
    <>
      <AccordionItem
        value={accordionValue}
        isOpen={true}
        className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
        contentClassName="p-3 sm:p-4"
        triggerClassName="h-auto! min-h-10! items-start! gap-y-1.5!"
        leading={
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-2 overflow-hidden md:gap-3">
            <span className={indexBadgeClassName}>{quoteDetailIndex + 1}</span>
            {hasQuotation ? (
              <Checkbox
                className="min-w-0 flex-1 overflow-hidden"
                labelClassName={productNameLabelClassName}
                label={productName}
                checked
                disabled
              />
            ) : (
              <Checkbox
                className="min-w-0 flex-1 overflow-hidden"
                name={`select-quote-product-${quoteDetailIndex}`}
                checked={isSelected}
                label={productName}
                labelClassName={productNameLabelClassName}
                onChange={(evt) => {
                  onSelectedChange?.(requestedProduct!, evt.target.checked ?? false);
                }}
                aria-label={`Seleccionar ${productName}`}
              />
            )}
          </div>
        }
        title={
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 md:gap-3">
            {categoryName ? (
              <span className="block min-w-0 truncate text-[13px] font-normal text-slate-500 md:text-[14px] dark:text-slate-300">
                / {categoryName}
              </span>
            ) : null}
            <span
              className={`flex min-w-0 items-center gap-1 text-[13px] font-normal md:shrink-0 md:text-[14px] ${quotationStatusColor}`}
            >
              <span className="text-slate-500 dark:text-slate-300">/</span>
              {hasQuotation ? (
                <CircleCheckBigIcon size={14} color="#22c55e" />
              ) : (
                <CircleXIcon size={15} color="#94a3b8" />
              )}
              {hasQuotation ? (
                <span className="min-w-0 truncate">
                  Cotizado
                  {assignedSuppliersCount > 0
                    ? ` · ${assignedSuppliersCount} proveedor${assignedSuppliersCount === 1 ? "" : "es"}`
                    : ""}
                </span>
              ) : (
                <span>Sin cotizar</span>
              )}
            </span>
          </div>
        }
      >
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <DetailField
            label="Producto"
            value={productName}
            icon={<PackageIcon size={18} />}
          />
          <DetailField
            label="Categoría"
            value={categoryName ? categoryName : null}
            icon={<LayersIcon size={18} />}
          />
          <DetailField
            label="Cantidad"
            value={quantityLabel}
            icon={<HashIcon size={18} />}
          />
          <DetailField
            label="Unidad de medida"
            value={unitMeasure}
            icon={<RulerIcon size={18} />}
          />
          <DetailField
            label="Detalles del producto"
            value={requestedProduct?.description}
            icon={<NotebookTextIcon size={18} />}
            containerClass="sm:col-span-2"
          />
          <DetailField
            label="Justificación"
            value={justification}
            icon={<NotebookTextIcon size={18} />}
            containerClass="sm:col-span-2"
          />
        </div>
      </AccordionItem>
    </>
  );
}
