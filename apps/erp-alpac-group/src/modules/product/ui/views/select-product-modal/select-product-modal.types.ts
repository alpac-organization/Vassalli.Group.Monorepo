import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export type SelectableCatalogProduct = GetProductResponse;

export type SelectProductModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	excludeProductIds?: string[];
	description?: string;
	productUsageType?: ProductUsageTypeEnum;
	onClose: () => void;
	onSelect: (products: SelectableCatalogProduct[]) => void;
};
