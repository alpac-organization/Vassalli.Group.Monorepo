/**
 * Derivaciones y transformaciones de los datos de una solicitud de vacaciones
 * a un formato adecuado para la UI del modal de detalles.
 * Toda la lógica de presentación vive aquí, los componentes sólo renderizan.
 */

import { getVacationControlStatusUiLabel } from "@app/modules/payroll/ui/pages/control-vacations/Constants/vacations-status.constants";
import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/utils/status-badge-color";
import type { ControlVacationStatus } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
// ─── Status helper

export function getStatusLabel(status: ControlVacationStatus): string {
  return getVacationControlStatusUiLabel(status);
}

export function getStatusColorClass(status: ControlVacationStatus): string {
  return statusBadgeColor(status);
}

// ─── Date formatting
/**
 * Formatea una fecha ISO a formato largo en español.
 * "2024-05-05" → "domingo, 5 de mayo de 2024"
 */
function formatLongDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const dateOnly = isoDate.split("T")[0];
  const d = new Date(`${dateOnly}T12:00:00`);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// ─── Derived UI state
export type VacationtDetailsUiState = {
  fullName: string;
  collaboratorCode: string;
  startDateFormatted: string;
  endDateFormatted: string;
  requestedDays: number;
  statusLabel: string;
  statusColorClass: string;
  description: string;
  requestedAtFormatted: string;
};

export function deriveVacationDetails(
  item: GetVacationsHistoryResponse,
  fullName: string,
): VacationtDetailsUiState {
  return {
    fullName,
    collaboratorCode: item.collaborator_code ?? "",
    startDateFormatted: formatLongDate(item.start_date),
    endDateFormatted: formatLongDate(item.end_date),
    requestedDays: countInclusiveCalendarDays(item.start_date, item.end_date),
    statusLabel: getStatusLabel(item.status),
    statusColorClass: getStatusColorClass(item.status),
    description: item.description?.trim() || "—",
    requestedAtFormatted: formatLongDate(item.created_at),
  };
}
