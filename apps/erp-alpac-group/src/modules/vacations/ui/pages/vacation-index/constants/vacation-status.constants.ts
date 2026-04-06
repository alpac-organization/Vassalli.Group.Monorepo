import type { VacationRequestStatus } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";

export const VACATION_STATUS_UI_LABEL: Record<VacationRequestStatus, string> = {
  Pending: "Pendiente",
  Approved: "Aprobada",
  Rejected: "Rechazada",
  Cancelled: "Cancelada",
};
export function getVacationStatusUiLabel(
  status: VacationRequestStatus,
): string {
  return VACATION_STATUS_UI_LABEL[status] ?? status;
}
