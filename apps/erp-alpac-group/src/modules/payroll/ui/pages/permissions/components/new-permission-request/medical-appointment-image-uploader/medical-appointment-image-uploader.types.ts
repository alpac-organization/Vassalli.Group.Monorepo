import type { MedicalAppointmentImage } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-form.types";

export type MedicalAppointmentImageUploaderProps = {
  value: MedicalAppointmentImage[];
  onChange: (images: MedicalAppointmentImage[]) => void;
  maxFiles?: number;
  minFiles?: number;
  error?: string;
};

export type ImagePreview = {
  id: string;
  file: File;
  preview: string;
};
