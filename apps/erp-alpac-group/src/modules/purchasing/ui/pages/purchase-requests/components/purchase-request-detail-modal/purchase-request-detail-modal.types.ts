import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface PurchaseRequestDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	/** Fila seleccionada de la tabla; se usa para pedir el detalle por id */
	purchaseRequest: GetPurchaseRequestResponse | null;
}
