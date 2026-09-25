import type { PurchaseRequestAdditionalData } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { ReactNode } from "react";

export interface PurchaseRequestHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	history?: PurchaseRequestAdditionalData[] | null;
}

export type HistoryModalProps = Omit<PurchaseRequestHistoryModalProps, "history">  & {
	children?: ReactNode;
}
