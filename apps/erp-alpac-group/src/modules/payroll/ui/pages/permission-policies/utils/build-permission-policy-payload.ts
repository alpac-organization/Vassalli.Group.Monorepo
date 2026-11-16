import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { PermitBeneficiaryScopeEnum } from "@app/modules/applications/domain/enums/permit-beneficiary-scope.enum";
import { PermitFamilyRelationshipEnum } from "@app/modules/applications/domain/enums/permit-family-relationship.enum";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { UpdatePermitTypePolicyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/update-permit-type-policy";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import type { EnumType } from "@app/shared/types/enum.type";

type BuildPermissionPolicyPayloadArgs = {
  companyId: string;
  moduleCode: string;
  values: PermissionPolicyFormValues;
  catalogs: PermissionPolicyCatalogs;
};

type BuildPermissionPolicyUpdateArgs = BuildPermissionPolicyPayloadArgs & {
  policy: GetPermissionPoliciesResponse;
};

export type PermissionPolicyCatalogs = {
  permitTypes: CatalogItem[];
  beneficiaryScopes: CatalogItem[];
  familyRelationships: CatalogItem[];
};

type ResolvedPolicyValues = {
  permit_application_type: number;
  permit_beneficiary_scope: number;
  family_relationship: number;
  required_approval_steps: number;
  requires_evidence: boolean;
  consumes_vacation_balance: boolean;
  min_evidence_count: number;
  max_evidence_count: number | null;
  max_amount_days: number | null;
};

const UPDATE_ROUTE_FIELDS = new Set([
  "company_id",
  "module_code",
  "permit_type_policy_id",
]);

const SIMPLE_UPDATE_FIELDS = [
  "permit_application_type",
  "permit_beneficiary_scope",
  "family_relationship",
  "required_approval_steps",
  "consumes_vacation_balance",
] as const;

function assignIfChanged<K extends keyof ResolvedPolicyValues>(
  payload: UpdatePermitTypePolicyRequest,
  field: K,
  current: ResolvedPolicyValues,
  next: ResolvedPolicyValues,
): void {
  if (current[field] === next[field]) return;

  Object.assign(payload, {
    [field]: next[field],
  });
}

function applyEvidenceChanges(
  payload: UpdatePermitTypePolicyRequest,
  current: ResolvedPolicyValues,
  next: ResolvedPolicyValues,
): void {
  if (!next.requires_evidence) {
    if (!current.requires_evidence) return;

    payload.requires_evidence = false;
    payload.min_evidence_count = 0;
    payload.max_evidence_count = 0;
    return;
  }

  const minChanged = next.min_evidence_count !== current.min_evidence_count;
  const maxChanged = next.max_evidence_count !== current.max_evidence_count;
  const evidenceEnabled = !current.requires_evidence && next.requires_evidence;

  if (!evidenceEnabled && !minChanged && !maxChanged) return;

  if (evidenceEnabled) {
    payload.requires_evidence = true;
  }

  payload.min_evidence_count = next.min_evidence_count;
  if (evidenceEnabled || maxChanged) {
    payload.max_evidence_count = next.max_evidence_count;
  }
}

function resolveEnumValue(
  catalogs: CatalogItem[],
  enumMap: Record<string, EnumType>,
  key: string,
): number {
  const catalogItem = catalogs.find((item) => item.name === key);
  if (catalogItem) return catalogItem.value;

  const entry = enumMap[key];
  if (entry == null) {
    throw new Error(`Valor de enum inválido: ${key}`);
  }
  return Number(entry.value);
}

function resolveMaxEvidenceCount(maxEvidenceCount: string): number | null {
  const maxRaw = maxEvidenceCount.trim();
  if (maxRaw === "") return null;
  return Number(maxRaw);
}

function resolvePolicyValues(
  values: PermissionPolicyFormValues,
  catalogs: PermissionPolicyCatalogs,
): ResolvedPolicyValues {
  const isFamilyNucleus = values.permit_beneficiary_scope === "FamilyNucleus";
  const requiresEvidence = values.requires_evidence;
  const maxAmountDaysRaw = values.max_amount_days.trim();
  const maxAmountDays =
    maxAmountDaysRaw === "" ? null : Number(maxAmountDaysRaw);

  return {
    permit_application_type: resolveEnumValue(
      catalogs.permitTypes,
      PermitApplicationTypeEnum,
      values.permit_application_type,
    ),
    permit_beneficiary_scope: resolveEnumValue(
      catalogs.beneficiaryScopes,
      PermitBeneficiaryScopeEnum,
      values.permit_beneficiary_scope,
    ),
    family_relationship: resolveEnumValue(
      catalogs.familyRelationships,
      PermitFamilyRelationshipEnum,
      isFamilyNucleus ? values.family_relationship : "None",
    ),
    required_approval_steps: Number(values.required_approval_steps),
    requires_evidence: requiresEvidence,
    consumes_vacation_balance: values.consumes_vacation_balance,
    min_evidence_count: requiresEvidence
      ? Number(values.min_evidence_count)
      : 0,
    max_evidence_count: requiresEvidence
      ? resolveMaxEvidenceCount(values.max_evidence_count)
      : 0,
    max_amount_days:
      maxAmountDays != null &&
      Number.isFinite(maxAmountDays) &&
      maxAmountDays > 0
        ? maxAmountDays
        : null,
  };
}

export function policyToFormValues(
  policy: GetPermissionPoliciesResponse,
): PermissionPolicyFormValues {
  const requiresEvidence =
    policy.min_evidence_count > 0 ||
    (policy.max_evidence_count != null && policy.max_evidence_count > 0);

  return {
    permit_application_type: policy.permit_application_type,
    permit_beneficiary_scope: policy.permit_beneficiary_scope,
    family_relationship:
      policy.permit_beneficiary_scope === "FamilyNucleus"
        ? policy.family_relationship
        : "None",
    max_amount_days:
      policy.max_amount_days == null ? "" : String(policy.max_amount_days),
    required_approval_steps: String(policy.required_approval_steps),
    requires_evidence: requiresEvidence,
    consumes_vacation_balance: policy.consumes_vacation_balance,
    min_evidence_count: String(requiresEvidence ? policy.min_evidence_count : 0),
    max_evidence_count:
      requiresEvidence &&
      policy.max_evidence_count != null &&
      policy.max_evidence_count > 0
        ? String(policy.max_evidence_count)
        : "",
  };
}

export function buildPermissionPolicyPayload({
  companyId,
  moduleCode,
  values,
  catalogs,
}: BuildPermissionPolicyPayloadArgs): CreatePermissionPoliciesRequest {
  const resolved = resolvePolicyValues(values, catalogs);

  return {
    company_id: companyId,
    module_code: moduleCode,
    permit_application_type: resolved.permit_application_type,
    permit_beneficiary_scope: resolved.permit_beneficiary_scope,
    family_relationship: resolved.family_relationship,
    is_active: true,
    requires_evidence: resolved.requires_evidence,
    consumes_vacation_balance: resolved.consumes_vacation_balance,
    min_evidence_count: resolved.min_evidence_count,
    max_evidence_count: resolved.max_evidence_count,
    required_approval_steps: resolved.required_approval_steps,
    ...(resolved.max_amount_days != null
      ? { max_amount_days: resolved.max_amount_days }
      : {}),
  };
}

export function buildPermissionPolicyUpdatePayload({
  companyId,
  moduleCode,
  policy,
  values,
  catalogs,
}: BuildPermissionPolicyUpdateArgs): UpdatePermitTypePolicyRequest {
  const current = resolvePolicyValues(policyToFormValues(policy), catalogs);
  const next = resolvePolicyValues(values, catalogs);

  const payload: UpdatePermitTypePolicyRequest = {
    company_id: companyId,
    module_code: moduleCode,
    permit_type_policy_id: policy.permit_type_policy_id,
  };

  for (const field of SIMPLE_UPDATE_FIELDS) {
    assignIfChanged(payload, field, current, next);
  }

  if (
    next.max_amount_days != null &&
    next.max_amount_days !== current.max_amount_days
  ) {
    payload.max_amount_days = next.max_amount_days;
  }

  applyEvidenceChanges(payload, current, next);

  return payload;
}

export function hasPolicyUpdateChanges(
  payload: UpdatePermitTypePolicyRequest,
): boolean {
  return Object.keys(payload).some((key) => !UPDATE_ROUTE_FIELDS.has(key));
}

export type ApiCatalogItem = {
  value: number;
  name: string;
};

export function mapCatalogItem(
  item: ApiCatalogItem,
  resolveLabel: (apiName: string) => string,
): CatalogItem {
  return {
    value: item.value,
    name: item.name,
    label: resolveLabel(item.name),
  };
}
