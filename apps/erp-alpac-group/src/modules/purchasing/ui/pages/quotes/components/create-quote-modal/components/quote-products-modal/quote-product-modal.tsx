import { useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Modal } from "@alpac/design-system";
import type { PurchaseRequestSupplierProduct } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { QuoteConfirmActions } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/components/quote-confirm-actions";
import { QuoteProductGroupFields } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/components/quote-product-group-fields";
import {
  hasBlockedCatalogPrice,
  mapFormValuesToDraftItems,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/helper/quote-item.mapper";
import { useEnrichSupplierPaymentMethods } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/hooks/use-enrich-supplier-payment-methods";
import type {
	QuoteProductFormValues,
	QuoteProductModalProps,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";
import { MIN_SUPPLIERS_PER_PRODUCT } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";

export function QuoteProductModal({
	isOpen,
	products,
	existingItems = [],
	onClose,
	onConfirm,
}: QuoteProductModalProps) {
	const { companyId, moduleCode } = useUserStore();
	const productsCount = products.length;

	const methods = useForm<QuoteProductFormValues>({
		defaultValues: { products: [] },
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		getValues,
		clearErrors,
		trigger,
		formState: { isSubmitting },
	} = methods;

	const { fields: productFields } = useFieldArray({
		control,
		name: "products",
	});

  const supplierLinksByItemId = useMemo(() => {
    const links = new Map<string, PurchaseRequestSupplierProduct[]>();
    for (const product of products) {
      if (!product.purchase_request_item_id) continue;
      links.set(
        product.purchase_request_item_id,
        product.product_details?.supplier_products ?? [],
      );
    }
    return links;
  }, [products]);

  // Al abrir, toma los ítems del catálogo y completa métodos de pago del proveedor en paralelo.
  const { isEnrichingPaymentMethods } = useEnrichSupplierPaymentMethods({
		isOpen,
		products,
		existingItems,
    companyId,
    moduleCode,
		reset,
		setValue,
		getValues,
		clearErrors,
  });

	const handleClose = () => {
		onClose();
	};

	const onSubmit = async (values: QuoteProductFormValues) => {
		const invalidProduct = values.products.find(
			(product) => product.items.length < MIN_SUPPLIERS_PER_PRODUCT,
		);

		if (invalidProduct) return;

		const isValid = await trigger();
		if (!isValid) return;

    if (hasBlockedCatalogPrice(values, supplierLinksByItemId)) return;

    onConfirm?.(mapFormValuesToDraftItems(values));
		handleClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="7xl"
			title="Cotizar productos"
			panelClassName={[
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col gap-2">
							{productsCount === 0 ? (
								<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
									No hay productos seleccionados para cotizar.
								</p>
							) : (
								<section className="flex flex-col gap-1">
									<ul className="m-0 list-none p-0">
										{productFields.map((field, index) => (
											<QuoteProductGroupFields
												key={field.id}
												productIndex={index}
												productName={field.product_name}
												categoryName={field.category_name}
                        isLoadingPaymentMethods={isEnrichingPaymentMethods}
                        isOpen={isOpen}
											/>
										))}
									</ul>
								</section>
							)}
						</div>
					</div>

          <QuoteConfirmActions
            productsCount={productsCount}
            isSubmitting={isSubmitting}
            isEnrichingPaymentMethods={isEnrichingPaymentMethods}
            supplierLinksByItemId={supplierLinksByItemId}
            onCancel={handleClose}
          />
				</form>
			</FormProvider>
		</Modal>
	);
}
