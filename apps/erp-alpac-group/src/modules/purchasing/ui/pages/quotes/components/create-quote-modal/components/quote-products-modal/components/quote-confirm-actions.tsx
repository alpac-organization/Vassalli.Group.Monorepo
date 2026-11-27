import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@alpac/design-system";
import { SaveIcon, XIcon } from "lucide-react";
import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import type { PurchaseRequestSupplierProduct } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { hasBlockedCatalogPrice } from "../helper/quote-item.mapper";
import { getActivePaymentMethods } from "../helper/quote-payment.helpers";
import {
	MIN_SUPPLIERS_PER_PRODUCT,
	type QuoteProductFormValues,
} from "../quote-product-modal.types";

export type QuoteConfirmActionsProps = {
	productsCount: number;
	minSuppliersPerProduct?: number;
	isSubmitting: boolean;
	isEnrichingPaymentMethods: boolean;
	supplierLinksByItemId: Map<string, PurchaseRequestSupplierProduct[]>;
	onCancel: () => void;
};
export function QuoteConfirmActions({
	productsCount,
	minSuppliersPerProduct = MIN_SUPPLIERS_PER_PRODUCT,
	isSubmitting,
	isEnrichingPaymentMethods,
	supplierLinksByItemId,
	onCancel,
}: QuoteConfirmActionsProps) {
	const { control } = useFormContext<QuoteProductFormValues>();
	const watchedProducts = useWatch({ control, name: "products" });
	const productsList = watchedProducts ?? [];

	const hasInsufficientSuppliers =
		productsCount > 0 &&
		productsList.some((product) => {
			const includedSupplierIds = new Set(
				(product.items ?? [])
					.filter((item) => item?.is_included !== false)
					.map((item) => item?.supplier_id?.trim())
					.filter(Boolean),
			);
			return includedSupplierIds.size < minSuppliersPerProduct;
		});

	const hasBlockedPrice = hasBlockedCatalogPrice(
		{ products: productsList },
		supplierLinksByItemId,
	);
	const hasSupplierWithoutPaymentMethod =
		!isEnrichingPaymentMethods &&
		productsList.some((product) =>
			(product.items ?? [])
				.filter((item) => item?.is_included !== false)
				.some(
					(item) =>
						getActivePaymentMethods(item.supplier_payment_methods).length === 0,
				),
		);

	const footerErrorMessage = hasInsufficientSuppliers
		? minSuppliersPerProduct === 1
			? "Debe dejar seleccionado al menos 1 proveedor por producto para confirmar."
			: `Cada producto requiere cotizar al menos ${minSuppliersPerProduct} proveedores distintos.`
		: hasBlockedPrice
			? "Hay proveedores seleccionados sin precio vigente para la cantidad solicitada. Desmárquelos o actualice el catálogo."
			: null;

	return (
		<div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				{footerErrorMessage ? (
					<p className="m-0 text-[13px] text-red-500 sm:mr-auto">
						{footerErrorMessage}
					</p>
				) : null}
				<Button
					type="button"
					label="Cancelar"
					size="giant"
					disabled={isSubmitting}
					onClick={onCancel}
					isHiddenLabelOnMobile
					icon={<XIcon size={20} />}
					className={quoteFormSecondaryButtonClassName}
				/>
				<Button
					type="submit"
					label="Confirmar cotización"
					size="giant"
					disabled={
						productsCount === 0 ||
						isSubmitting ||
						isEnrichingPaymentMethods ||
						hasInsufficientSuppliers ||
						hasBlockedPrice ||
						hasSupplierWithoutPaymentMethod
					}
					isLoading={isSubmitting || isEnrichingPaymentMethods}
					isHiddenLabelOnMobile
					icon={<SaveIcon size={20} />}
					className={quoteFormPrimaryButtonClassName}
				/>
			</div>
		</div>
	);
}
