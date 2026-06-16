import type { PermissionStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";

const VACATION_STATUS_UI_LABEL: Record<PermissionStatus, string> = {
  Pending: "Pendiente",
  Approved: "Aprobada",
  Rejected: "Rechazada",
  Cancelled: "Cancelada",
};
export function getPermissionStatusUiLabel(status: PermissionStatus): string {
  return VACATION_STATUS_UI_LABEL[status] ?? status;
}
