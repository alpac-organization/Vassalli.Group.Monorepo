import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
export type PermissionRequestDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: PermissionResponse | null;
  collaboratorFullName: string;
};
