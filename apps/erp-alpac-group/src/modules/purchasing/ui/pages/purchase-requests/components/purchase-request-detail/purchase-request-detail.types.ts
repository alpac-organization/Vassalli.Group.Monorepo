import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type PurchaseRequestDetailProps = {
   requestType: PurchaseRequestEnum;
   disableActions?: boolean;
   lockItems?: boolean;
   isEditMode?: boolean;
   onRequestError?: (message?: string) => void;
   onRequestSuccess?: (message: string) => void;
}