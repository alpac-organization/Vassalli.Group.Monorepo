import type { PermissionHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/permission-history-response";
export type PermissionRequestDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: PermissionHistoryResponse | null;
  collaboratorFullName: string;
};
