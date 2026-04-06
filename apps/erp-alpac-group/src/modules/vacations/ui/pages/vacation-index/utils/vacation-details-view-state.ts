/**
 * Derivaciones y transformaciones de los datos de una solicitud de vacaciones
 * a un formato adecuado para la UI del modal de detalles.
 * Toda la lógica de presentación vive aquí, los componentes sólo renderizan.
 */

import type { VacationRequestStatus } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import type { VacationHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-history-response";
import { getVacationStatusUiLabel } from "@app/modules/vacations/ui/pages/vacation-index/constants/vacation-status.constants";
import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";

// ─── Status helper

const STATUS_COLOR: Record<VacationRequestStatus, string> = {
  Pending:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  Approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  Cancelled: "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export function getStatusLabel(status: VacationRequestStatus): string {
  return getVacationStatusUiLabel(status);
}

export function getStatusColorClass(status: VacationRequestStatus): string {
  return STATUS_COLOR[status] ?? "bg-slate-100 text-slate-800";
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

// ─── Derived UI stateType
export type VacationRequestDetailsUiState = {
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

/**
 * buenoa aqui lo Transformamos un `VacationHistoryResponse` y el nombre del colaborador
 * en un objeto listo para renderizar en el modal de detalles.
 */
export function deriveVacationRequestDetails(
  item: VacationHistoryResponse,
  fullName: string,
): VacationRequestDetailsUiState {
  return {
    fullName,
    collaboratorCode: item.collaborator_code || item.collaborator_id,
    startDateFormatted: formatLongDate(item.start_date),
    endDateFormatted: formatLongDate(item.end_date),
    requestedDays: countInclusiveCalendarDays(item.start_date, item.end_date),
    statusLabel: getStatusLabel(item.status),
    statusColorClass: getStatusColorClass(item.status),
    description: item.description?.trim() || "—",
    requestedAtFormatted: formatLongDate(item.created_at),
  };
}
