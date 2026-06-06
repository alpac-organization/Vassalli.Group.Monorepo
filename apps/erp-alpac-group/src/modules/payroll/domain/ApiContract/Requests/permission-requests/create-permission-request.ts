export interface CreatePermissionRequestBase {
  payroll_id: string;
  company_id: string;
  module_code: string;
  permit_application_type: number;
  description?: string | null;
  channel: number;
  permit_application_vacation?: CreateVacationPermissionRequest;
  permit_application_donated_vacations?: CreateDonatedVacationPermissionRequest;
  permit_application_medical_appointment?: CreateMedicalAppointmentPermissionRequest;
}

interface CreateVacationPermissionRequest {
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  is_full_day: boolean;
  is_it_midday: boolean;
  with_range_hours: boolean;
}

interface CreateDonatedVacationPermissionRequest {
  amount_days: number;
  identification_collaborator_to_receive: string;
}

interface CreateMedicalAppointmentPermissionRequest {
  is_full_day: boolean;
  start_date: string;
  start_time?: string | null;
  end_time?: string | null;
  images: ImageMedicalAppointment[];
}
interface ImageMedicalAppointment {
  image_base64?: string | null;
  content_type?: string | null;
}

export type PermissionType =
  | "Vacation"
  | "MedicalAppointment"
  // | "CompensatoryTime"
  // | "PaidLeave"
  // | "UnpaidLeave"
  // | "SpecialLeave"
  | "DonatedVacations";
