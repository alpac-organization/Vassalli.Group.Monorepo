import type { ReactNode } from "react";
import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type PurchaseRequestProductsTableViewImagesPayload = {
	productName: string;
	images: ImagePayload[];
};

export type PurchaseRequestProductsTableProps = {
	products: PurchaseRequestProductInformation[];
	onViewImages: (payload: PurchaseRequestProductsTableViewImagesPayload) => void;
	renderRowExtra?: (product: PurchaseRequestProductInformation) => ReactNode;
};
