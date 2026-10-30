import { useFormContext } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/constants/permission-policy-form.constants";
import {
  validateOptionalPositiveInteger,
  validateRequiredInteger,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/utils/permission-policy-field-rules";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

export function PolicyLimitsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PermissionPolicyFormValues>();

  return (
    <>
      <InputText
        label="Máximo de días"
        type="number"
        className={inputClassName}
        labelClassName={labelClassName}
        errorVariant="tooltip"
        error={errors.max_amount_days?.message}
        {...register("max_amount_days", {
          validate: validateOptionalPositiveInteger,
        })}
      />

      <InputText
        label="Pasos de aprobación"
        type="number"
        className={inputClassName}
        labelClassName={labelClassName}
        errorVariant="tooltip"
        error={errors.required_approval_steps?.message}
        {...register("required_approval_steps", {
          required: "Ingrese los pasos de aprobación",
          validate: validateRequiredInteger,
        })}
      />
    </>
  );
}
