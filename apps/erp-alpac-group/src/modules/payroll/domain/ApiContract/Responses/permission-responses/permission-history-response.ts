import type { PermissionStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
export interface PermissionResponse {
  payroll_id: string;
  collaborator_id: string;
  permit_apllication_id: string;

  description?: string;
  requested_by?: string;
  additional_data?: string;
  collaborator_code?: string;
  full_name?: string;
  first_step_status: StepStatus;
  second_step_status: StepStatus;

  amount_days?: number;

  end_time?: string;
  start_time?: string;
  end_date: string;
  start_date: string;
  created_at: string;
  status: PermissionStatus;
  type: PermissionType;
}

export interface StepStatus {
  is_approved: boolean | null;
  reviewed_by?: string;
}

export type PermissionAdditionalData = {
  MedicalAppointmentData?: {
    IsFullDay?: boolean;
    ImagesAttached?: unknown[];
  };
  VacationData?: {
    IsFullDay?: boolean;
    IsItMidday?: boolean;
    WithRangeHours?: boolean;
  };
};

export interface PermissionListResponse {
  data: PermissionResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
