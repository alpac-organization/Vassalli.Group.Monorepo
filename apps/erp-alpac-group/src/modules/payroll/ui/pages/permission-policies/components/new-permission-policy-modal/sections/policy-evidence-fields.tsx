import { AnimatePresence, m } from "framer-motion";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Checkbox, InputText } from "@alpac/design-system";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/constants/permission-policy-form.constants";
import {
  validateMaxEvidenceCount,
  validateRequiredPositiveInteger,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/utils/permission-policy-field-rules";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

export function PolicyEvidenceFields() {
  const {
    control,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<PermissionPolicyFormValues>();

  const requiresEvidence = useWatch({
    control,
    name: "requires_evidence",
  });

  return (
    <>
      <Controller
        name="requires_evidence"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Requiere evidencia"
            labelClassName={labelClassName}
            checked={field.value}
            onChange={(event) => {
              const checked = event.target.checked;
              field.onChange(checked);
              if (!checked) {
                setValue("min_evidence_count", "0", { shouldValidate: true });
                setValue("max_evidence_count", "0", { shouldValidate: true });
              } else {
                setValue("min_evidence_count", "1", { shouldValidate: true });
                setValue("max_evidence_count", "1", { shouldValidate: true });
              }
            }}
          />
        )}
      />

      <AnimatePresence initial={false}>
        {requiresEvidence ? (
          <m.div
            key="evidence-counts"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
              <InputText
                label="Evidencia mínima"
                type="number"
                className={inputClassName}
                labelClassName={labelClassName}
                errorVariant="tooltip"
                error={errors.min_evidence_count?.message}
                {...register("min_evidence_count", {
                  required: "Ingrese la evidencia mínima",
                  validate: validateRequiredPositiveInteger,
                  onChange: () => {
                    void trigger("max_evidence_count");
                  },
                })}
              />

              <InputText
                label="Evidencia máxima"
                type="number"
                className={inputClassName}
                labelClassName={labelClassName}
                errorVariant="tooltip"
                error={errors.max_evidence_count?.message}
                {...register("max_evidence_count", {
                  required: "Ingrese la evidencia máxima",
                  validate: (value) =>
                    validateMaxEvidenceCount(
                      value,
                      getValues("min_evidence_count"),
                    ),
                })}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
