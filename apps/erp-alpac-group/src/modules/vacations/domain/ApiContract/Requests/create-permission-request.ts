
export interface CreatePermissionRequestBase {
   company_id: string;
   module_code: string;
   identification_number: string;
   permit_application_type: number;
   description: string;
   channel: number;
   permit_application_vacation?: CreateVacationPermissionRequest;
   permit_application_donated_vacations?: CreateDonatedVacationPermissionRequest;
   permit_application_medical_appointment?: CreateMedicalAppointmentPermissionRequest;
}

export interface CreateVacationPermissionRequest {
   start_date: string;
   end_date: string;
   start_time?: string | null;
   end_time?: string | null;
   is_full_day: boolean;
   is_it_midday: boolean;
   with_range_hours: boolean;
}

export interface CreateDonatedVacationPermissionRequest {
   amount_days: number;
   identification_collaborator_to_receive: string;
}

export interface CreateMedicalAppointmentPermissionRequest {
   is_full_day: boolean;
   start_date: string;
   start_time?: string | null;
   end_time?: string | null;
}

export type PermissionType =
   | "Vacation"
   | "MedicalAppointment"
   // | "CompensatoryTime"
   // | "PaidLeave"
   // | "UnpaidLeave"
   // | "SpecialLeave"
   | "DonatedVacations";
