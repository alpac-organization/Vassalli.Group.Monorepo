import type { ProcessPurchaseOrderPayload } from "@app/modules/management/domain/ApiContract/requests/process-purchase-order-payload";
import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export type ProcessPurchaseOrderModalProps = {
  isOpen: boolean;  
  isSubmitting?: boolean;
  requisitionManagementReview: RequisitionManagementReviewDto
  onClose: () => void;
  onConfirm: (payload: ProcessPurchaseOrderPayload) => void;
};
