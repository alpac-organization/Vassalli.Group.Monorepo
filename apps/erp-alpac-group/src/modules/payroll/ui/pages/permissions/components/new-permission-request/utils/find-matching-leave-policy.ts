import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

type FindMatchingLeavePolicyArgs = {
  policies: GetPermissionPoliciesResponse[];
  permitApplicationType: string;
  beneficiaryScope: string;
  familyRelationship: string;
};

export function findMatchingLeavePolicy({
  policies,
  permitApplicationType,
  beneficiaryScope,
  familyRelationship,
}: FindMatchingLeavePolicyArgs): GetPermissionPoliciesResponse | undefined {
  const relationship =
    beneficiaryScope === "Own" ? "None" : familyRelationship;

  return policies.find(
    (policy) =>
      policy.is_active &&
      String(policy.permit_application_type) === permitApplicationType &&
      String(policy.permit_beneficiary_scope) === beneficiaryScope &&
      String(policy.family_relationship) === relationship,
  );
}
