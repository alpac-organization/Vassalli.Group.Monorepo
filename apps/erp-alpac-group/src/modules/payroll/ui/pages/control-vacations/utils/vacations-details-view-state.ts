/**
 * Derivaciones y transformaciones de los datos de una solicitud de vacaciones
 * a un formato adecuado para la UI del modal de detalles.
 * Toda la lógica de presentación vive aquí, los componentes sólo renderizan.
 */

import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";
import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";
import { formatLongDate } from "@app/shared/utils/string.utils";
// ─── Status helper


// ─── Date formatting
/**
 * Formatea una fecha ISO a formato largo en español.
 * "2024-05-05" → "domingo, 5 de mayo de 2024"
 */

// ─── Derived UI state
export type VacationtDetailsUiState = {
  fullName: string;
  collaboratorCode: string;
  startDateFormatted: string;
  endDateFormatted: string;
  requestedDays: number;
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
    description: item.description?.trim() || "—",
    requestedAtFormatted: formatLongDate(item.created_at),
  };
}
