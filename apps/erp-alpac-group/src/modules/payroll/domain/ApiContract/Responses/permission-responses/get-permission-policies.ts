export interface GetPermissionPoliciesResponse {
  permit_type_policy_id: string;
  permit_application_type: string;
  permit_application_type_label: string;
  permit_beneficiary_scope: string;
  permit_beneficiary_label: string;
  family_relationship: string;
  family_relationship_label: string;
  max_amount_days?: number | null;
  max_evidence_count: number | null;
  min_evidence_count: number;
  is_active: boolean;
  consumes_vacation_balance: boolean;
  required_approval_steps: number;
}

export interface PagedPermitTypePoliciesResponse {
  data: GetPermissionPoliciesResponse[];
  page_number: number;
  page_size: number;
  total: number;
}

