import type { PermissionStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { ApplicationType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/application.types";
import type { PermissionType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission.types";

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
  related_person_name?: string | null;
  beneficiary_scope?: string | null;
  family_relationship?: string | null;

  end_time?: string;
  start_time?: string;
  end_date: string;
  start_date: string;
  created_at: string;
  status: PermissionStatus;
  type: ApplicationType | PermissionType;
}

export interface StepStatus {
  is_approved: boolean | null;
  reviewed_by?: string;
}

export interface EvidenceImage {
  ContentType?: string | null;
  ImageBase64?: string | null;
}

export type PermissionAdditionalData = {
  MedicalAppointmentData?: {
    IsFullDay?: boolean;
    ImagesAttached?: EvidenceImage[];
  };
  VacationData?: {
    IsFullDay?: boolean;
    IsItMidday?: boolean;
    WithRangeHours?: boolean;
  };
  LeaveEvidenceData?: {
    Evidence?: EvidenceImage[];
    RequireApprovalSteps?: number;
    ConsumesVacationBalance?: boolean;
  };
};

export interface PermissionListResponse {
  data: PermissionResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
