export interface CreatePermissionRequestBase {
  payroll_id: string;
  company_id: string;
  module_code: string;
  permit_application_type: number;
  description?: string | null;
  channel: number;
  identification_number: string;
  permit_application_vacation?: CreateVacationPermissionRequest;
  permit_application_donated_vacations?: CreateDonatedVacationPermissionRequest;
  permit_application_medical_appointment?: CreateMedicalAppointmentPermissionRequest;
  permit_application_vacation_pay?: CreateVacationPayApplicationRequest;
  permit_application_leave?: CreatePermissionLeaveReq;
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
  images: ImageBaseType[];
}

interface ImageBaseType {
  image_base64?: string | null;
  content_type?: string | null;
}

interface CreateVacationPayApplicationRequest {
  amount_days: number;
  request_date: string;
}
interface CreatePermissionLeaveReq {
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  beneficiary_scope: number;
  family_relationship: number;
  related_person: string | null;
  images: ImageBaseType[];
}