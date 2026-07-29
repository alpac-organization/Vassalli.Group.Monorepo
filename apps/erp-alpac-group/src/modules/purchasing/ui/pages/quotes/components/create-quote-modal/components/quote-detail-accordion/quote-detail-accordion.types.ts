import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface QuoteDetailAccordionProps {
	quoteDetailIndex: number;
	accordionValue: string;
	product?: GetProductResponse;
	onRemove: () => void;
}
