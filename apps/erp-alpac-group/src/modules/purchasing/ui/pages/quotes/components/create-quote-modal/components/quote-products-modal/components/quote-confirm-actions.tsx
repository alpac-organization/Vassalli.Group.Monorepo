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
import type { QuoteProductFormValues } from "../quote-product-modal.types";

export type QuoteConfirmActionsProps = {
	productsCount: number;
	isSubmitting: boolean;
	isEnrichingPaymentMethods: boolean;
	supplierLinksByItemId: Map<string, PurchaseRequestSupplierProduct[]>;
	onCancel: () => void;
};
export function QuoteConfirmActions({
	productsCount,
	isSubmitting,
	isEnrichingPaymentMethods,
	supplierLinksByItemId,
	onCancel,
}: QuoteConfirmActionsProps) {
	const { control } = useFormContext<QuoteProductFormValues>();
	const watchedProducts = useWatch({ control, name: "products" });
	const hasBlockedPrice = hasBlockedCatalogPrice(
		{ products: watchedProducts ?? [] },
		supplierLinksByItemId,
	);
	const hasSupplierWithoutPaymentMethod =
		!isEnrichingPaymentMethods &&
		(watchedProducts ?? []).some((product) =>
			product.items.some(
				(item) =>
					getActivePaymentMethods(item.supplier_payment_methods).length === 0,
			),
		);

	return (
		<div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				{hasBlockedPrice ? (
					<p className="m-0 text-[13px] text-red-500 sm:mr-auto">
						Hay proveedores sin precio vigente para la cantidad solicitada. Quite
						ese proveedor o actualice el vínculo en el catálogo.
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
