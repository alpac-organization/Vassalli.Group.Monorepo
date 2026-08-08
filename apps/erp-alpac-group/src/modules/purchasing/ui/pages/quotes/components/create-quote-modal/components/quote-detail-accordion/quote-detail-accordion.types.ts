import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface QuoteDetailAccordionProps {
	quoteDetailIndex: number;
	accordionValue: string;
	requestedProduct?: PurchaseRequestProductInformation;	
	onSelectedChange?: (requestedProduct: PurchaseRequestProductInformation, selected: boolean) => void;
}
