import { FormProvider } from "react-hook-form";
import type { PermissionPolicyFormProps } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import { usePermissionPolicyForm } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/hooks/use-permission-policy-form";
import { PolicyIdentityFields } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/sections/policy-identity-fields";
import { PolicyLimitsFields } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/sections/policy-limits-fields";
import { PolicyEvidenceFields } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/sections/policy-evidence-fields";
import { PolicyFormActions } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/sections/policy-form-actions";

export function NewPermissionPolicyForm({
  isPending,
  permitTypes,
  beneficiaryScopes,
  familyRelationships,
  onSubmit,
  onCancel,
}: PermissionPolicyFormProps) {
  const { methods, submitPolicy } = usePermissionPolicyForm({ onSubmit });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitPolicy)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PolicyIdentityFields
            permitTypes={permitTypes}
            beneficiaryScopes={beneficiaryScopes}
            familyRelationships={familyRelationships}
          />
          <PolicyLimitsFields />
        </div>

        <PolicyEvidenceFields />

        <PolicyFormActions isPending={isPending} onCancel={onCancel} />
      </form>
    </FormProvider>
  );
}
