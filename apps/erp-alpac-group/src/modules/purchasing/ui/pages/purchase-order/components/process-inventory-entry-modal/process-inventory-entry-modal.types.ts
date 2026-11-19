import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";

export interface ProcessInventoryEntryModalProps {
   isOpen:     boolean;
   order:      GetPurchaseOrdersResponse | null;
   isLoading?: boolean;
   onClose:    () => void;
   onConfirm:  () => void;
}
