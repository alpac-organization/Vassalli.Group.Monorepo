import type { Ref } from "react";
import type { RoleEnum } from "@app/core/enums/role.enum";
import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";

export type PurchaseRequestFormBlockHandle = {
	validate: () => Promise<boolean>;
	getValues: () => CreatePurchaseRequestPayload;
};

export type PurchaseRequestFormBlockProps = {
	index: number;
	defaults: CreatePurchaseRequestPayload;
	role: RoleEnum;
	requestType: PurchaseRequestEnum;
	onDuplicate: (purchaseRequestPayload: CreatePurchaseRequestPayload) => void;
	onRemove: () => void;
	onRequestError?: (message?: string) => void;
	onRequestSuccess?: (message: string) => void;
	ref?: Ref<PurchaseRequestFormBlockHandle>;
};
