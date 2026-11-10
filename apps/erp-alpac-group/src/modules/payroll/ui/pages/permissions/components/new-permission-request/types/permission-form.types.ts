import type { DatePickerValue } from "@alpac/design-system";
import type { PermissionType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission.types";
import type { UseFormSetError } from "react-hook-form";

export type MedicalAppointmentImage = {
  image_base64: string;
  content_type: string;
};

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
  beneficiary_scope?: string;
  family_relationship?: string;
  related_person?: string;
  description: string;
}

export type PermissionFormSetError =
  UseFormSetError<PermissionRequestFormValues>;
