import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { PaymentRequestDocumentDetails } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/map-payment-request-from-purchase-order";

export interface PurchaseOrderDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	purchaseOrderId: string;
	details?: PaymentRequestDocumentDetails | null;
	products?: PurchaseRequestProductInformation[];
}
