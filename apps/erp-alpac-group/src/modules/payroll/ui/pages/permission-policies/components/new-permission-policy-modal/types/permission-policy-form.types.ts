import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";

export type PermissionPolicyFormValues = {
  permit_application_type: string;
  permit_beneficiary_scope: string;
  family_relationship: string;
  max_amount_days: string;
  required_approval_steps: string;
  requires_evidence: boolean;
  min_evidence_count: string;
  max_evidence_count: string;
  is_paid: boolean;
  is_active: boolean;
  consumes_vacation_balance: boolean;
};

export type PermissionPolicyFormProps = {
  isPending: boolean;
  permitTypes: CatalogItem[];
  beneficiaryScopes: CatalogItem[];
  familyRelationships: CatalogItem[];
  onSubmit: (payload: CreatePermissionPoliciesRequest) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
};

export type NewPermissionPolicyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};
