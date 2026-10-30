import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

export const inputClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const labelClassName = "text-black! dark:text-white!";

export const HIDDEN_PERMIT_TYPES = new Set([
  "CompensatoryTime",
  "PaidLeave",
  "UnpaidLeave",
  "SpecialLeave",
]);

export const FAMILY_ONLY_PERMIT_TYPES = new Set([
  "BirthLeave",
  "BereavementLeave",
]);

export const DEFAULT_VALUES: PermissionPolicyFormValues = {
  permit_application_type: "",
  permit_beneficiary_scope: "",
  family_relationship: "None",
  max_amount_days: "",
  required_approval_steps: "1",
  requires_evidence: false,
  min_evidence_count: "0",
  max_evidence_count: "0",
};
