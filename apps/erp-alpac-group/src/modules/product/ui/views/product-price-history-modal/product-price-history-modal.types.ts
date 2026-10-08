import type { CurrencyCode } from "@app/core/enums/currency.enum";

export interface ProductPriceHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	supplierId: string;
	supplierLabel: string;
	currency?: CurrencyCode;
}
