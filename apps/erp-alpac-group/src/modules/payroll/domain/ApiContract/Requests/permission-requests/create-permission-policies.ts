import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreatePermissionPoliciesRequest extends BaseRequest {
  permit_application_type: number;
  permit_beneficiary_scope: number;
  family_relationship: number;
  is_paid: boolean;
  is_active?: boolean;
  requires_evidence: boolean;
  consumes_vacation_balance: boolean;
  min_evidence_count: number;
  max_evidence_count: number;
  required_approval_steps: number;
  max_amount_days?: number | null;
}
