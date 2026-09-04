import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-pending-assignments.response";

export interface UnloadingDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	pendingAssignment: PendingAssignment | null;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
