import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { PermitBeneficiaryScopeEnum } from "@app/modules/applications/domain/enums/permit-beneficiary-scope.enum";
import { PermitFamilyRelationshipEnum } from "@app/modules/applications/domain/enums/permit-family-relationship.enum";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import type { EnumType } from "@app/shared/types/enum.type";
import type {
  CatalogItem,
} from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";

type BuildPermissionPolicyPayloadArgs = {
  companyId: string;
  moduleCode: string;
  values: PermissionPolicyFormValues;
};

function resolveEnumValue(
  enumMap: Record<string, EnumType>,
  key: string,
): number {
  const entry = enumMap[key];
  if (entry == null) {
    throw new Error(`Valor de enum inválido: ${key}`);
  }
  return Number(entry.value);
}

export function buildPermissionPolicyPayload({
  companyId,
  moduleCode,
  values,
}: BuildPermissionPolicyPayloadArgs): CreatePermissionPoliciesRequest {
  const requiresEvidence = values.requires_evidence;
  const isFamilyNucleus = values.permit_beneficiary_scope === "FamilyNucleus";
  const maxAmountDaysRaw = values.max_amount_days.trim();
  const maxAmountDays =
    maxAmountDaysRaw === "" ? null : Number(maxAmountDaysRaw);

  return {
    company_id: companyId,
    module_code: moduleCode,
    permit_application_type: resolveEnumValue(
      PermitApplicationTypeEnum,
      values.permit_application_type,
    ),
    permit_beneficiary_scope: resolveEnumValue(
      PermitBeneficiaryScopeEnum,
      values.permit_beneficiary_scope,
    ),
    family_relationship: resolveEnumValue(
      PermitFamilyRelationshipEnum,
      isFamilyNucleus ? values.family_relationship : "None",
    ),
    is_paid: values.is_paid,
    is_active: values.is_active,
    requires_evidence: requiresEvidence,
    consumes_vacation_balance: false,
    min_evidence_count: Number(values.min_evidence_count),
    max_evidence_count: Number(values.max_evidence_count),
    required_approval_steps: Number(values.required_approval_steps),
    max_amount_days:
      maxAmountDays != null &&
      Number.isFinite(maxAmountDays) &&
      maxAmountDays > 0
        ? maxAmountDays
        : null,
  };
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