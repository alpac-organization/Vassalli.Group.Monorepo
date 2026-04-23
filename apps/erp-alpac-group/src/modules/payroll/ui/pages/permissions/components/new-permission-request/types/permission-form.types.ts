import type { DatePickerValue } from "@alpac/design-system";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { UseFormSetError } from "react-hook-form";

/**
 * Valores capturados y gestionados dentro del formulario de permiso.
 */
export interface PermissionRequestFormValues {
  type: PermissionType;
  start_date: DatePickerValue;
  end_date: DatePickerValue;
  start_time?: string;
  end_time?: string;
  donated_vacation_days?: number;
  beneficiary_identification?: string;
  description: string;
}

/** Tipo de `setError` de react-hook-form alineado con los campos del formulario. */
export type PermissionFormSetError =
  UseFormSetError<PermissionRequestFormValues>;
