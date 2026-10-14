import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export type LinkedSupplierQuotePrice = {
	supplier: GetSuppliersResponse;
	price_unit: number;
	preferential_price: number | null;
	currency: CurrencyCode;
};

export type LinkSupplierProductModalProps = {
	isOpen: boolean;
	productId: string;
	productLabel: string;
	defaultUnitMeasureId?: string;
	suppliers: GetSuppliersResponse[];
	onClose: () => void;
	onLinked: (linked: LinkedSupplierQuotePrice[]) => void;
	onPendingSuppliersChange?: (suppliers: GetSuppliersResponse[]) => void;
	onRequestAddMore?: () => void;
	onRequestError?: (message: string) => void;
};
