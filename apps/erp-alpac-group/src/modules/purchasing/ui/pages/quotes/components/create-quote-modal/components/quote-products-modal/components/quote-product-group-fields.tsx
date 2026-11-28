import { useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { AccordionGroup, Badges } from "@alpac/design-system";
import { CircleAlert } from "lucide-react";
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
  minSuppliersPerProduct = MIN_SUPPLIERS_PER_PRODUCT,
  isLoadingPaymentMethods = false,
  isOpen = true,
}: QuoteProductGroupFieldsProps) {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<QuoteProductFormValues>();

  const { fields } = useFieldArray({
    control,
    name: `products.${productIndex}.items`,
    rules: {
      validate: (items) => {
        const supplierIds = (items ?? [])
          .filter((item) => item.is_included !== false)
          .map((item) => item.supplier_id?.trim())
          .filter(Boolean);
        const uniqueIds = new Set(supplierIds);

        if (uniqueIds.size < minSuppliersPerProduct) {
          return minSuppliersPerProduct === 1
            ? "Cada producto debe cotizarse con al menos un proveedor."
            : `Cada producto debe cotizarse con al menos ${minSuppliersPerProduct} proveedores distintos para competir.`;
        }

        if (uniqueIds.size < supplierIds.length) {
          return "No puede repetir el mismo proveedor en un producto.";
        }

        return true;
      },
    },
  });

  const watchedItems = useWatch({
    control,
    name: `products.${productIndex}.items`,
  });

  const includedFlags = useMemo(
    () =>
      fields.map((_, idx) => {
        const watched = watchedItems?.[idx];
        return (watched?.is_included ?? fields[idx]?.is_included) !== false;
      }),
    [fields, watchedItems],
  );

  const includedSuppliersCount = useMemo(() => {
    const ids = new Set<string>();
    fields.forEach((field, idx) => {
      if (!includedFlags[idx]) return;
      const supplierId = (
        watchedItems?.[idx]?.supplier_id ?? field.supplier_id
      )?.trim();
      if (supplierId) {
        ids.add(supplierId);
      }
    });
    return ids.size;
  }, [fields, includedFlags, watchedItems]);

  const [closedQuotationIds, setClosedQuotationIds] = useState<string[]>([]);

  const openQuotations = useMemo(
    () =>
      fields
        .filter((_, idx) => includedFlags[idx])
        .map((field) => field.id)
        .filter((id) => !closedQuotationIds.includes(id)),
    [fields, includedFlags, closedQuotationIds],
  );

  const handleToggleInclude = (itemIndex: number, nextIncluded: boolean) => {
    const fieldId = fields[itemIndex]?.id;
    const itemPath = `products.${productIndex}.items.${itemIndex}` as const;

    setValue(`${itemPath}.is_included`, nextIncluded, {
      shouldDirty: true,
      shouldValidate: false,
    });

    if (!nextIncluded) {
      clearErrors(itemPath);
      if (fieldId) {
        setClosedQuotationIds((prev) =>
          prev.includes(fieldId) ? prev : [...prev, fieldId],
        );
      }
    } else {
      if (fieldId) {
        setClosedQuotationIds((prev) => prev.filter((id) => id !== fieldId));
      }
      clearErrors(`products.${productIndex}.items`);
    }
  };

  const handleSelectOnlyThis = (targetIndex: number) => {
    fields.forEach((field, idx) => {
      const keep = idx === targetIndex;
      const itemPath = `products.${productIndex}.items.${idx}` as const;
      setValue(`${itemPath}.is_included`, keep, {
        shouldDirty: true,
        shouldValidate: false,
      });
      if (!keep) {
        clearErrors(itemPath);
      }
      void field;
    });

    setClosedQuotationIds(
      fields
        .filter((_, idx) => idx !== targetIndex)
        .map((field) => field.id),
    );
    clearErrors(`products.${productIndex}.items`);
  };

  const groupError =
    errors.products?.[productIndex]?.items?.root?.message ??
    errors.products?.[productIndex]?.items?.message;

  const hasCatalogShortfall =
    fields.length > 0 && fields.length < minSuppliersPerProduct;
  const hasSelectionShortfall =
    !hasCatalogShortfall &&
    fields.length > 0 &&
    includedSuppliersCount < minSuppliersPerProduct;

  const isCriticalSingleRule = minSuppliersPerProduct === 1;

  return (
    <li className="flex flex-col gap-4 border-b border-slate-200 py-8 last:border-b-0 dark:border-neutral-600">
      <input
        type="hidden"
        {...register(`products.${productIndex}.product_id`)}
      />
      <input
        type="hidden"
        {...register(`products.${productIndex}.purchase_request_item_id`)}
      />
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
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

        {fields.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badges
              label={
                isCriticalSingleRule
                  ? "Prioridad crítica: mín. 1 proveedor"
                  : `Mín. ${minSuppliersPerProduct} proveedores`
              }
              color={
                includedSuppliersCount >= minSuppliersPerProduct
                  ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300"
                  : "bg-red-500/15 text-red-700 border border-red-500/30 dark:text-red-300"
              }
            />
            <Badges
              label={`${includedSuppliersCount} de ${fields.length} seleccionado${includedSuppliersCount === 1 ? "" : "s"}`}
              color="bg-slate-200/80 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200"
            />
          </div>
        ) : null}
      </div>

      {isCriticalSingleRule && fields.length > 1 ? (
        <p className="m-0 text-[13px] text-slate-500 dark:text-slate-400">
          Esta requisición es de prioridad crítica: puede cotizar un único
          proveedor desmarcando los demás o usando &ldquo;Dejar solo esta&rdquo;.
        </p>
      ) : null}

      {hasCatalogShortfall ? (
        <div
          role="alert"
          className="flex w-full items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5"
        >
          <CircleAlert
            size={18}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
          <p className="m-0 text-[13px] text-red-700 dark:text-red-300">
            Este producto solo tiene {fields.length} proveedor vinculado en el
            catálogo. Para solicitudes con prioridad diferente a Crítica debe
            vincular y cotizar al menos {minSuppliersPerProduct} proveedores
            distintos.
          </p>
        </div>
      ) : hasSelectionShortfall ? (
        <div
          role="alert"
          className="flex w-full items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5"
        >
          <CircleAlert
            size={18}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
          <p className="m-0 text-[13px] text-red-700 dark:text-red-300">
            {isCriticalSingleRule
              ? "Seleccione al menos 1 proveedor para cotizar este producto."
              : `Debe mantener al menos ${minSuppliersPerProduct} proveedores seleccionados para cotizar este producto (actualmente: ${includedSuppliersCount}).`}
          </p>
        </div>
      ) : groupError ? (
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
            const nextOpen = new Set(
              Array.isArray(value) ? value : value ? [value] : [],
            );
            setClosedQuotationIds(
              fields
                .filter((_, idx) => includedFlags[idx])
                .map((field) => field.id)
                .filter((id) => !nextOpen.has(id)),
            );
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
              isIncluded={includedFlags[itemIndex]}
              canSelectOnlyThis={
                isCriticalSingleRule &&
                fields.length > 1 &&
                includedFlags[itemIndex] &&
                includedSuppliersCount > 1
              }
              onToggleInclude={(nextIncluded) =>
                handleToggleInclude(itemIndex, nextIncluded)
              }
              onSelectOnlyThis={() => handleSelectOnlyThis(itemIndex)}
            />
          ))}
        </AccordionGroup>
      )}
    </li>
  );
}
