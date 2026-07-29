import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export type SelectableCatalogProduct = GetProductResponse;

export type SelectProductModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	excludeProductIds?: string[];
	onClose: () => void;
	onSelect: (products: SelectableCatalogProduct[]) => void;
};
