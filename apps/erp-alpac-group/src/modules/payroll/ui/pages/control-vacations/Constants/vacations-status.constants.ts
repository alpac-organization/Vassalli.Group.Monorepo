import type { ControlVacationStatus } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export const VACATION_CONTROL_STATUS_UI_LABEL: Record<
  ControlVacationStatus,
  string
> = {
  Pending: "Pendiente",
  Cancelled: "Cancelada",
};
export function getVacationControlStatusUiLabel(
  status: ControlVacationStatus,
): string {
  return VACATION_CONTROL_STATUS_UI_LABEL[status] ?? status;
}
