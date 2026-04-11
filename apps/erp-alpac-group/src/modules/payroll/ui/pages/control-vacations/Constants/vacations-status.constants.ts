import type { VacationStatus } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export const VACATION_CONTROL_STATUS_UI_LABEL: Record<VacationStatus, string> =
  {
    Pending: "Pendiente",
    Cancelled: "Cancelada",
  };
export function getVacationControlStatusUiLabel(
  status: VacationStatus,
): string {
  return VACATION_CONTROL_STATUS_UI_LABEL[status] ?? status;
}
