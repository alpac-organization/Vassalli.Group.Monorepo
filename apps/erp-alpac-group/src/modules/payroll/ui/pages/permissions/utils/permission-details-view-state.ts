/**
 * Derivaciones y transformaciones de los datos de una solicitud de permiso
 * a un formato adecuado para la UI del modal de detalles.
 * Toda la lógica de presentación vive aquí, los componentes sólo renderizan.
 */

import type { PermissionStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type {
  PermissionAdditionalData,
  PermissionResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { formatTimeOrDash } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/utils/validate.details-content";
import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import {
  extractMedicalAppointmentImages,
  parsePermissionAdditionalData,
} from "@app/modules/payroll/ui/pages/permissions/utils/permission-additional-data.utils";

// ─── Status helper

const STATUS_COLOR: Record<PermissionStatus, string> = {
  Pending:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  Approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  Cancelled: "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

function getStatusLabel(status: PermissionStatus): string {
  return getPermissionStatusUiLabel(status);
}

function getStatusColorClass(status: PermissionStatus): string {
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

function hasTimeValue(time?: string | null): boolean {
  return typeof time === "string" && time.trim().length > 0;
}

function resolveDurationModeLabel(
  item: PermissionResponse,
  additional: PermissionAdditionalData | null,
): string | null {
  if (item.type === "MedicalAppointment") {
    const isFullDay =
      additional?.MedicalAppointmentData?.IsFullDay ??
      (!hasTimeValue(item.start_time) && !hasTimeValue(item.end_time));
    return isFullDay ? "Día completo" : "Rango de horas";
  }

  if (item.type === "Vacation") {
    const vacationData = additional?.VacationData;
    if (vacationData?.WithRangeHours) return "Rango de horas";
    if (vacationData?.IsItMidday) return "Medio día";
    if (vacationData?.IsFullDay) return "Día completo";
    if (hasTimeValue(item.start_time) || hasTimeValue(item.end_time)) {
      return "Rango de horas";
    }
    if (item.amount_days === 0.5) return "Medio día";
    return "Día completo";
  }

  return null;
}

function resolveShowTimeRange(
  item: PermissionResponse,
  durationModeLabel: string | null,
): boolean {
  if (item.type === "MedicalAppointment") {
    return (
      durationModeLabel !== "Día completo" &&
      (hasTimeValue(item.start_time) || hasTimeValue(item.end_time))
    );
  }
  return hasTimeValue(item.start_time) || hasTimeValue(item.end_time);
}

// ─── Derived UI state
export type PermissionRequestDetailsUiState = {
  fullName: string;
  collaboratorCode: string;
  permissionTypeLabel: string;
  isVacationType: boolean;
  isMedicalAppointment: boolean;
  startDateFormatted: string;
  endDateFormatted: string;
  showEndDate: boolean;
  requestedDays: number;
  durationModeLabel: string | null;
  showTimeRange: boolean;
  startTimeFormatted: string;
  endTimeFormatted: string;
  statusLabel: string;
  statusColorClass: string;
  description: string;
  requestedAtFormatted: string;
  requestedBy: string | null;
  managerFullname: string | null;
  administratorFullName: string | null;
  firstStepApproved: boolean | null;
  secondStepApproved: boolean | null;
  medicalAppointmentImages: ImagePayload[];
};

export function derivePermissionRequestDetails(
  item: PermissionResponse,
  fullName: string,
): PermissionRequestDetailsUiState {
  const isVacationType = item.type === "Vacation";
  const isMedicalAppointment = item.type === "MedicalAppointment";
  const additional = parsePermissionAdditionalData(item.additional_data);
  const durationModeLabel = resolveDurationModeLabel(item, additional);
  const showTimeRange = resolveShowTimeRange(item, durationModeLabel);
  const managerFullname = item.first_step_status.reviewed_by ?? null;
  const administratorFullname = item.second_step_status.reviewed_by ?? null;
  const medicalAppointmentImages = isMedicalAppointment
    ? extractMedicalAppointmentImages(item.additional_data)
    : [];

  return {
    fullName: item.full_name?.trim() || fullName,
    collaboratorCode: item.collaborator_code || item.collaborator_id,
    permissionTypeLabel: PERMISSION_TYPE_LABEL[item.type] ?? item.type,
    isVacationType,
    isMedicalAppointment,
    startDateFormatted: formatLongDate(item.start_date),
    endDateFormatted: formatLongDate(item.end_date),
    showEndDate: !isMedicalAppointment,
    requestedDays: item.amount_days ?? 0,
    durationModeLabel,
    showTimeRange,
    startTimeFormatted: formatTimeOrDash(item.start_time),
    endTimeFormatted: formatTimeOrDash(item.end_time),
    statusLabel: getStatusLabel(item.status),
    statusColorClass: getStatusColorClass(item.status),
    description: item.description?.trim() || "—",
    requestedAtFormatted: formatLongDate(item.created_at),
    requestedBy: item.requested_by?.trim() || null,
    managerFullname: managerFullname ?? null,
    administratorFullName: administratorFullname ?? null,
    firstStepApproved: item.first_step_status.is_approved,
    secondStepApproved: item.second_step_status.is_approved,
    medicalAppointmentImages,
  };
}

