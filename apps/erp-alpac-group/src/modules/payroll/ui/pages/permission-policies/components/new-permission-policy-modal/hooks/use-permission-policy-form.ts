import { useForm, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { DEFAULT_VALUES } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/constants/permission-policy-form.constants";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

type UsePermissionPolicyFormArgs = {
  onSubmit: (values: PermissionPolicyFormValues) => void;
};

type UsePermissionPolicyFormResult = {
  methods: UseFormReturn<PermissionPolicyFormValues>;
  submitPolicy: SubmitHandler<PermissionPolicyFormValues>;
};

export function usePermissionPolicyForm({
  onSubmit,
}: UsePermissionPolicyFormArgs): UsePermissionPolicyFormResult {
  const methods = useForm<PermissionPolicyFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
    shouldUnregister: false,
  });

  const submitPolicy: SubmitHandler<PermissionPolicyFormValues> = (values) => {
    onSubmit(values);
  };

  return {
    methods,
    submitPolicy,
  };
}
