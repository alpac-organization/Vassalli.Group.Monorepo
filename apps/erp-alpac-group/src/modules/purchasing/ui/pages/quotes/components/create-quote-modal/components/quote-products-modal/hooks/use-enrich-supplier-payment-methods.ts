import { useEffect, useMemo, useRef, useState } from "react";
import type {
  UseFormClearErrors,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { supplierDetailsQueryOptions } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { getActivePaymentMethods } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/helper/quote-payment.helpers";
import {
  buildInitialQuotationItems,
  emptyQuotationItem,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/helper/quote-item.mapper";
import type {
  DraftQuotationItem,
  QuoteProductFormValues,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";

type UseEnrichSupplierPaymentMethodsArgs = {
  isOpen: boolean;
  products: PurchaseRequestProductInformation[];
  existingItems: DraftQuotationItem[];
  companyId: string;
  moduleCode: string;
  reset: UseFormReset<QuoteProductFormValues>;
  setValue: UseFormSetValue<QuoteProductFormValues>;
  getValues: UseFormGetValues<QuoteProductFormValues>;
  clearErrors: UseFormClearErrors<QuoteProductFormValues>;
};

// Identifica cada producto solicitado con sus proveedores. El useeffect la usa
// para no reiniciar el formulario si el arreglo cambia de referencia
const toProductSuppliersKey = (products: PurchaseRequestProductInformation[]) =>
  products
    .map((product) => {
      const supplierIds = (product.product_details?.supplier_products ?? [])
        .map((supplier) => supplier.supplier_id?.trim())
        .filter(Boolean)
        .join(",");
      return `${product.purchase_request_item_id ?? ""}:${supplierIds}`;
    })
    .join("|");

// Identifica las cotizaciones ya armadas por ítem y proveedor.
const toDraftSuppliersKey = (items: DraftQuotationItem[]) =>
  items
    .map(
      (item) =>
        `${item.purchase_request_item_id ?? ""}:${item.supplier_id?.trim() ?? ""}`,
    )
    .join("|");

/*
  Al abrir, arma las cotizaciones del catálogo y completa los métodos de pago
  del proveedor. La alerta de "sin métodos" solo aplica cuando el detalle ya respondió.
 */
export const useEnrichSupplierPaymentMethods = ({
  isOpen,
  products,
  existingItems,
  companyId,
  moduleCode,
  reset,
  setValue,
  getValues,
  clearErrors,
}: UseEnrichSupplierPaymentMethodsArgs) => {
  const queryClient = useQueryClient();
  const [isEnrichingPaymentMethods, setIsEnrichingPaymentMethods] =
    useState(false);

  const productsRef = useRef(products);
  const existingItemsRef = useRef(existingItems);
  productsRef.current = products;
  existingItemsRef.current = existingItems;

  const productSuppliersKey = useMemo(
    () => toProductSuppliersKey(products),
    [products],
  );
  const draftSuppliersKey = useMemo(
    () => toDraftSuppliersKey(existingItems),
    [existingItems],
  );

  useEffect(() => {
    if (!isOpen) {
      setIsEnrichingPaymentMethods(true);
      reset({ products: [] });
      return;
    }

    const nextProducts = productsRef.current.map((product) => {
      const productId = product.product_details?.product_id ?? "";
      const purchaseRequestItemId = product.purchase_request_item_id ?? "";

      return {
        product_id: productId,
        purchase_request_item_id: purchaseRequestItemId,
        product_name:
          product.product_details?.product_name?.trim() ||
          "Producto sin nombre",
        category_name:
          product.product_details?.category_information?.name?.trim() || null,
        quantity: product.quantity,
        items: buildInitialQuotationItems(product, existingItemsRef.current),
      };
    });

    reset({ products: nextProducts });

    const suppliersToEnrich = nextProducts.flatMap((product, productIndex) =>
      product.items.flatMap((item, itemIndex) => {
        const supplierId = item.supplier_id?.trim();
        const hasActivePaymentMethods =
          getActivePaymentMethods(item.supplier_payment_methods).length > 0;

        if (!supplierId || hasActivePaymentMethods) return [];

        return [{ productIndex, itemIndex, supplierId }];
      }),
    );

    if (
      !companyId.trim() ||
      !moduleCode.trim() ||
      suppliersToEnrich.length === 0
    ) {
      setIsEnrichingPaymentMethods(false);
      return;
    }

    const supplierIds = [
      ...new Set(suppliersToEnrich.map((target) => target.supplierId)),
    ];

    let cancelled = false;
    setIsEnrichingPaymentMethods(true);

    void (async () => {
      try {
        const detailsEntries = await Promise.all(
          supplierIds.map(async (supplierId) => {
            const options = supplierDetailsQueryOptions({
              company_id: companyId,
              module_code: moduleCode,
              supplier_id: supplierId,
            });

            const details = await queryClient
              .fetchQuery({
                queryKey: options.queryKey,
                queryFn: options.queryFn,
                staleTime: options.staleTime,
              })
              .catch(() => null);

            return [supplierId, details] as const;
          }),
        );

        if (cancelled) return;

        const detailsBySupplierId = new Map(detailsEntries);

        suppliersToEnrich.forEach((target) => {
          const details = detailsBySupplierId.get(target.supplierId);
          if (!details) return;

          const currentItem = getValues(
            `products.${target.productIndex}.items.${target.itemIndex}`,
          );
          if (!currentItem || currentItem.supplier_id !== target.supplierId) {
            return;
          }

          const paymentMethods = details.supplier_payment_methods ?? [];
          const preferred =
            details.supplier_details?.preferred_payment_method ?? undefined;
          const enriched = emptyQuotationItem(
            currentItem.purchase_request_item_id,
            {
              supplier_id: currentItem.supplier_id,
              supplier_legal_name: currentItem.supplier_legal_name ?? "",
            },
            paymentMethods,
            preferred,
          );
          const activePaymentMethods = getActivePaymentMethods(
            enriched.supplier_payment_methods,
          );
          const fieldPath =
            `products.${target.productIndex}.items.${target.itemIndex}` as const;

          setValue(
            `${fieldPath}.supplier_payment_methods`,
            enriched.supplier_payment_methods,
            { shouldDirty: false },
          );
          setValue(
            `${fieldPath}.preferred_payment_method`,
            enriched.preferred_payment_method,
            { shouldDirty: false },
          );

          if (activePaymentMethods.length === 0) {
            setValue(`${fieldPath}.payment_method`, undefined, {
              shouldDirty: false,
            });
            return;
          }

          if (!enriched.payment_method) return;

          setValue(`${fieldPath}.payment_method`, enriched.payment_method, {
            shouldDirty: false,
            shouldValidate: true,
          });
          clearErrors(`${fieldPath}.payment_method`);
        });
      } finally {
        if (!cancelled) {
          setIsEnrichingPaymentMethods(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    productSuppliersKey,
    draftSuppliersKey,
    companyId,
    moduleCode,
    queryClient,
    reset,
    setValue,
    getValues,
    clearErrors,
  ]);

  return { isEnrichingPaymentMethods };
};
