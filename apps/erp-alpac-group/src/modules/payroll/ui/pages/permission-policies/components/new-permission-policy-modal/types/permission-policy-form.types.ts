import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";

export type PermissionPolicyFormValues = {
  permit_application_type: string;
  permit_beneficiary_scope: string;
  family_relationship: string;
  max_amount_days: string;
  required_approval_steps: string;
  requires_evidence: boolean;
  min_evidence_count: string;
  max_evidence_count: string;
};

export type PermissionPolicyFormProps = {
  isPending: boolean;
  permitTypes: CatalogItem[];
  beneficiaryScopes: CatalogItem[];
  familyRelationships: CatalogItem[];
  onSubmit: (values: PermissionPolicyFormValues) => void;
  onCancel: () => void;
};

export type NewPermissionPolicyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};
