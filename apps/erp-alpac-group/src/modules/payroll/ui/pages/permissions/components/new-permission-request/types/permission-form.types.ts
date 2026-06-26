import type { DatePickerValue } from "@alpac/design-system";
import type { PermissionType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission.types";
import type { UseFormSetError } from "react-hook-form";

export type MedicalAppointmentImage = {
  image_base64: string;
  content_type: string;
};

/**
 * Valores capturados y gestionados dentro del formulario de permiso.
 */
export interface PermissionRequestFormValues {
  type: PermissionType;
  start_date: DatePickerValue;
  end_date: DatePickerValue;
  start_time?: string;
  end_time?: string;
  amount_days?: number;
  donated_vacation_days?: number;
  beneficiary_identification?: string;
  medical_images?: MedicalAppointmentImage[];
  description: string;
}

/** Tipo de `setError` de react-hook-form alineado con los campos del formulario. */
export type PermissionFormSetError =
  UseFormSetError<PermissionRequestFormValues>;
