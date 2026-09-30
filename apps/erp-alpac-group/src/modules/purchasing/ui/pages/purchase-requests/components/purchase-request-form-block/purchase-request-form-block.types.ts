import type { Ref } from "react";
import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";

export type PurchaseRequestFormBlockHandle = {
	validate: () => Promise<boolean>;
	getValues: () => CreatePurchaseRequestPayload;
	getServiceOrderId: () => string | undefined;
};

export type PurchaseRequestFormBlockProps = {
	index: number;
	defaults: CreatePurchaseRequestPayload;
	requestType: PurchaseRequestEnum;
	isEditMode?: boolean;
	onDuplicate: (purchaseRequestPayload: CreatePurchaseRequestPayload) => void;
	onRemove: () => void;
	onRequestError?: (message?: string) => void;
	onRequestSuccess?: (message: string) => void;
	onCheckOsSelection?: (osId: string) => boolean;
	ref?: Ref<PurchaseRequestFormBlockHandle>;
};
