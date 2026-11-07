import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type AnalyzedQuoteProductsListViewImagesPayload = {
	productName: string;
	images: ImagePayload[];
};

export type AnalyzedQuoteProductsListProps = {
	products: PurchaseRequestProductInformation[];
	onViewImages: (payload: AnalyzedQuoteProductsListViewImagesPayload) => void;
};
