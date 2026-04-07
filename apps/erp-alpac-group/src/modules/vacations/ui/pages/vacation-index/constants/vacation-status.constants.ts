import type { PermissionRequestStatus } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";

export const VACATION_STATUS_UI_LABEL: Record<PermissionRequestStatus, string> =
  {
    Pending: "Pendiente",
    Approved: "Aprobada",
    Rejected: "Rechazada",
    Cancelled: "Cancelada",
  };
export function getPermissionStatusUiLabel(
  status: PermissionRequestStatus,
): string {
  return VACATION_STATUS_UI_LABEL[status] ?? status;
}
