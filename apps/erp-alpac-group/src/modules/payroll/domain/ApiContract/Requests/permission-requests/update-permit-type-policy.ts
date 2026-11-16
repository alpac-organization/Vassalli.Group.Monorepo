import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdatePermitTypePolicyRequest extends BaseRequest {
  permit_type_policy_id: string;
  permit_application_type?: number;
  family_relationship?: number;
  permit_beneficiary_scope?: number;
  max_amount_days?: number;
  max_evidence_count?: number;
  min_evidence_count?: number;
  is_active?: boolean;
  requires_evidence?: boolean;
  consumes_vacation_balance?: boolean;
  required_approval_steps?: number;
}
