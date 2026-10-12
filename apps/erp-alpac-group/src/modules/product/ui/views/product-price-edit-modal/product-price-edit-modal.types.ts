import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { ProductSupplierTierPrice } from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export type PriceEditLinkInitial = {
	unit_price: number;
	currency?: CurrencyCode | null;
	unit_measure_id?: string | null;
	tier_prices?: ProductSupplierTierPrice[] | null;
};

export interface ProductPriceEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	supplierId: string;
	counterpartLabel?: string;
	initial: PriceEditLinkInitial | null;
	/** Which PATCH route to use. Default: product → suppliers/.../prices */
	updateVia?: "product" | "supplier";
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
