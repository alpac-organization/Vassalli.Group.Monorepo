/**
 * Derivaciones y transformaciones de los datos de una solicitud de vacaciones
 * a un formato adecuado para la UI del modal de detalles.
 * Toda la lógica de presentación vive aquí, los componentes sólo renderizan.
 */

import type { PermissionRequestStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-history-request";
import type { PermissionHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { formatRequestedDays } from "@app/shared/utils/vacation.utils";

// ─── Status helper

const STATUS_COLOR: Record<PermissionRequestStatus, string> = {
   Pending:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
   Approved:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
   Rejected: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
   Cancelled: "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

function getStatusLabel(status: PermissionRequestStatus): string {
   return getPermissionStatusUiLabel(status);
}

function getStatusColorClass(status: PermissionRequestStatus): string {
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

// ─── Derived UI state
export type PermissionRequestDetailsUiState = {
   fullName: string;
   collaboratorCode: string;
   permissionTypeLabel: string;
   isVacationType: boolean;
   startDateFormatted: string;
   endDateFormatted: string;
   requestedDays: string;
   startTime: string | null;
   endTime: string | null;
   statusLabel: string;
   statusColorClass: string;
   description: string;
   requestedAtFormatted: string;
   managerFullname: string | null;
   administratorFullName: string | null;
   firstStepApproved: boolean | null;
   secondStepApproved: boolean | null;
};

export function derivePermissionRequestDetails(
   item: PermissionHistoryResponse,
   fullName: string,
): PermissionRequestDetailsUiState {
   const isVacationType = item.type === "Vacation";

   return {
      fullName,
      collaboratorCode: item.collaborator_code || item.collaborator_id,
      permissionTypeLabel: PERMISSION_TYPE_LABEL[item.type] ?? item.type,
      isVacationType,
      startDateFormatted: formatLongDate(item.start_date),
      endDateFormatted: formatLongDate(item.end_date),
      requestedDays: formatRequestedDays(item.amount_days),
      startTime: !isVacationType && item.start_time ? item.start_time : null,
      endTime: !isVacationType && item.end_time ? item.end_time : null,
      statusLabel: getStatusLabel(item.status),
      statusColorClass: getStatusColorClass(item.status),
      description: item.description?.trim() || "—",
      requestedAtFormatted: formatLongDate(item.created_at),
      managerFullname: item.manager_fullname,
      administratorFullName: item.administrator_full_name,
      firstStepApproved: item.firts_step_approved,
      secondStepApproved: item.second_step_approved,
   };
}
