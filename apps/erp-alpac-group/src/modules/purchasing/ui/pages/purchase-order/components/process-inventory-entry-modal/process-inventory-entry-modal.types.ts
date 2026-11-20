import type { PurchaseOrderStatusType } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";

export interface ProcessInventoryEntryModalProps {
  isOpen: boolean;
  order: GetPurchaseOrdersResponse | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface DocumentCodeBadgeModel {
  label: string;
  value: string;
  color: string;
}

export interface OrderSummaryModel {
  orderCode: string;
  requestCode: string;
  supplierName: string;
  status: PurchaseOrderStatusType;
  sentToReviewAt: string | null;
  comments: string | null;
  sentBy: UserInformation | null;
  senderWorkArea: string | null;
}

export interface OrderProductRowModel {
  purchaseOrderItemId: string;
  productName: string;
  productCode: string;
  quantityLabel: string;
  unitPriceLabel: string;
  totalLabel: string;
  costCenterLabel: string;
}
