import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import type { Option } from "@alpac/design-system";

export const inputClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const labelClassName = "text-black! dark:text-white!";

export const POLICY_PERMIT_TYPES = new Set([
  "JudicialAppointment",
  "MarriageLeave",
  "BirthLeave",
  "BereavementLeave",
]);

export const POLICY_PERMIT_TYPE_OPTIONS = [
  { label: "Cita judicial", value: "JudicialAppointment" },
  { label: "Permiso de matrimonio", value: "MarriageLeave" },
  { label: "Permiso de nacimiento", value: "BirthLeave" },
  { label: "Permiso de fallecimiento", value: "BereavementLeave" },
];

export const FAMILY_ONLY_PERMIT_TYPES = new Set([
  "BirthLeave",
  "BereavementLeave",
]);
export const ACTIVE_FILTER_OPTIONS: Option[] = [
  { label: "Todas", value: "all" },
  { label: "Activas", value: "active" },
];
export const PAGE_SIZE = 10;

export const TYPE_FILTER_OPTIONS: Option[] = [
  { label: "Todos los tipos", value: "all" },
  ...POLICY_PERMIT_TYPE_OPTIONS,
];



export const DEFAULT_VALUES: PermissionPolicyFormValues = {
  permit_application_type: "",
  permit_beneficiary_scope: "",
  family_relationship: "None",
  max_amount_days: "",
  required_approval_steps: "1",
  requires_evidence: false,
  consumes_vacation_balance: false,
  min_evidence_count: "0",
  max_evidence_count: "0",
};
