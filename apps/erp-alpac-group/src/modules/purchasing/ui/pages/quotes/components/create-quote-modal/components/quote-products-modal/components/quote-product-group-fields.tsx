import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AccordionGroup } from "@alpac/design-system";
import { MIN_SUPPLIERS_PER_PRODUCT } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";
import type {
  QuoteProductFormValues,
  QuoteProductGroupFieldsProps,
} from "../quote-product-modal.types";
import { QuotationItemFields } from "./quotation-item-fields";
export function QuoteProductGroupFields({
  productIndex,
  productName,
  categoryName,
  isLoadingPaymentMethods = false,
  isOpen = true,
}: QuoteProductGroupFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QuoteProductFormValues>();

  const { fields } = useFieldArray({
    control,
    name: `products.${productIndex}.items`,
    rules: {
      validate: (items) => {
        const supplierIds = (items ?? [])
          .map((item) => item.supplier_id?.trim())
          .filter(Boolean);
        const uniqueIds = new Set(supplierIds);

        if (uniqueIds.size < MIN_SUPPLIERS_PER_PRODUCT) {
          return "Cada producto debe cotizarse con al menos dos proveedores distintos para competir.";
        }

        if (uniqueIds.size < supplierIds.length) {
          return "No puede repetir el mismo proveedor en un producto.";
        }

        return true;
      },
    },
  });

  const [openQuotations, setOpenQuotations] = useState<string[]>([]);

  useEffect(() => {
    setOpenQuotations(fields.map((field) => field.id));
  }, [fields]);

  const groupError =
    errors.products?.[productIndex]?.items?.root?.message ??
    errors.products?.[productIndex]?.items?.message;

  return (
    <li className="flex flex-col gap-4 border-b border-slate-200 py-10 last:border-b-0 dark:border-neutral-600">
      <input
        type="hidden"
        {...register(`products.${productIndex}.product_id`)}
      />
      <input
        type="hidden"
        {...register(`products.${productIndex}.purchase_request_item_id`)}
      />
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
            {productIndex + 1}
          </span>
          <span className="min-w-0 truncate text-[16px] font-medium text-slate-800 dark:text-white">
            {productName}
            {categoryName ? (
              <span className="font-normal text-slate-500 dark:text-slate-400">
                {" "}
                · {categoryName}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      {groupError ? (
        <p className="m-0 text-[13px] text-red-500">{groupError}</p>
      ) : null}

      {fields.length === 0 ? (
        <p className="m-0 rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-neutral-600 dark:text-slate-400">
          Este producto no tiene proveedores vinculados en el catálogo. Vincule
          proveedores al producto antes de cotizarlo.
        </p>
      ) : (
        <AccordionGroup
          type="multiple"
          value={openQuotations}
          onValueChange={(value) => {
            const nextValue = Array.isArray(value)
              ? value
              : value
                ? [value]
                : [];
            setOpenQuotations(nextValue);
          }}
          className="gap-3"
        >
          {fields.map((field, itemIndex) => (
            <QuotationItemFields
              key={field.id}
              productIndex={productIndex}
              itemIndex={itemIndex}
              accordionValue={field.id}
              supplierLegalName={field.supplier_legal_name || ""}
              isLoadingPaymentMethods={isLoadingPaymentMethods}
              isOpen={isOpen}
            />
          ))}
        </AccordionGroup>
      )}
    </li>
  );
}
