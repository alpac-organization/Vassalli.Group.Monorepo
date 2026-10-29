import { useMemo } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { AnimatePresence, m } from "framer-motion";
import { Button, Checkbox, Dropdown, InputText } from "@alpac/design-system";
import {
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { buildPermissionPolicyPayload } from "@app/modules/payroll/ui/pages/permission-policies/utils/build-permission-policy-payload";
import type {
  PermissionPolicyFormProps,
  PermissionPolicyFormValues,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

const inputClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const labelClassName = "text-black! dark:text-white!";

const HIDDEN_PERMIT_TYPES = new Set([
  "CompensatoryTime",
  "PaidLeave",
  "UnpaidLeave",
  "SpecialLeave",
]);

const FAMILY_ONLY_PERMIT_TYPES = new Set(["BirthLeave", "BereavementLeave"]);

const DEFAULT_VALUES: PermissionPolicyFormValues = {
  permit_application_type: "",
  permit_beneficiary_scope: "",
  family_relationship: "None",
  max_amount_days: "",
  required_approval_steps: "1",
  requires_evidence: false,
  min_evidence_count: "0",
  max_evidence_count: "0",
  is_paid: false,
  is_active: true,
  consumes_vacation_balance: false,
};

export function NewPermissionPolicyForm({
  isPending,
  permitTypes,
  beneficiaryScopes,
  familyRelationships,
  onSubmit,
  onCancel,
  companyId,
  moduleCode,
}: PermissionPolicyFormProps) {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<PermissionPolicyFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
    shouldUnregister: false,
  });

  const requiresEvidence = useWatch({
    control,
    name: "requires_evidence",
  });
  const permitApplicationType = useWatch({
    control,
    name: "permit_application_type",
  });
  const beneficiaryScope = useWatch({
    control,
    name: "permit_beneficiary_scope",
  });
  const minEvidenceCount = useWatch({
    control,
    name: "min_evidence_count",
  });

  const isFamilyNucleus = beneficiaryScope === "FamilyNucleus";

  const permitTypeOptions = useMemo(
    () =>
      permitTypes
        .filter((item) => !HIDDEN_PERMIT_TYPES.has(item.name))
        .map((item) => ({
          label: item.label,
          value: item.name,
        })),
    [permitTypes],
  );

  const hideOwnScope = FAMILY_ONLY_PERMIT_TYPES.has(permitApplicationType);

  const beneficiaryScopeOptions = useMemo(
    () =>
      beneficiaryScopes
        .filter((item) => !(hideOwnScope && item.name === "Own"))
        .map((item) => ({
          label: item.label,
          value: item.name,
        })),
    [beneficiaryScopes, hideOwnScope],
  );

  const familyRelationshipOptions = useMemo(
    () =>
      familyRelationships
        .filter((item) => item.name !== "None")
        .map((item) => ({
          label: item.label,
          value: item.name,
        })),
    [familyRelationships],
  );

  const handleFormSubmit: SubmitHandler<PermissionPolicyFormValues> = (
    values,
  ) => {
    onSubmit(
      buildPermissionPolicyPayload({
        companyId,
        moduleCode,
        values,
      }),
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="permit_application_type"
          control={control}
          rules={{ required: "Seleccione el tipo de permiso" }}
          render={({ field }) => (
            <Dropdown
              label="Tipo de permiso"
              appearance="dark"
              placeholder="Seleccione un tipo"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (
                  FAMILY_ONLY_PERMIT_TYPES.has(String(value)) &&
                  beneficiaryScope === "Own"
                ) {
                  setValue("permit_beneficiary_scope", "", {
                    shouldValidate: true,
                  });
                  setValue("family_relationship", "None", {
                    shouldValidate: true,
                  });
                }
              }}
              options={permitTypeOptions}
              isRequired
              labelClassName={labelClassName}
              valueClassName={labelClassName}
              className={dropdownClassName}
              error={errors.permit_application_type?.message}
              errorVariant="tooltip"
            />
          )}
        />

        <Controller
          name="permit_beneficiary_scope"
          control={control}
          rules={{ required: "Seleccione el alcance del beneficiario" }}
          render={({ field }) => (
            <Dropdown
              label="Alcance "
              appearance="dark"
              placeholder="Seleccione un alcance"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (value !== "FamilyNucleus") {
                  setValue("family_relationship", "None", {
                    shouldValidate: true,
                  });
                }
              }}
              options={beneficiaryScopeOptions}
              isRequired
              labelClassName={labelClassName}
              valueClassName={labelClassName}
              className={dropdownClassName}
              error={errors.permit_beneficiary_scope?.message}
              errorVariant="tooltip"
            />
          )}
        />

        <Controller
          name="family_relationship"
          control={control}
          rules={{
            validate: (value) => {
              if (isFamilyNucleus && (!value || value === "None")) {
                return "Seleccione el parentesco familiar";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <Dropdown
              label="Parentesco"
              appearance="dark"
              placeholder="Seleccione un parentesco"
              value={
                isFamilyNucleus && field.value !== "None" ? field.value : ""
              }
              onChange={field.onChange}
              options={familyRelationshipOptions}
              disabled={!isFamilyNucleus}
              isRequired={isFamilyNucleus}
              labelClassName={labelClassName}
              valueClassName={labelClassName}
              className={dropdownClassName}
              error={errors.family_relationship?.message}
              errorVariant="tooltip"
            />
          )}
        />

        <InputText
          label="Máximo de días"
          type="number"
          className={inputClassName}
          labelClassName={labelClassName}
          errorVariant="tooltip"
          error={errors.max_amount_days?.message}
          {...register("max_amount_days", {
            validate: {
              integer: (value) =>
                value === "" || value == null
                  ? true
                  : validateIntegerNumber(value),
              positive: (value) =>
                value === "" || value == null
                  ? true
                  : validatePositiveNumber(value, false),
            },
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
            validate: {
              integer: validateIntegerNumber,
              oneOrTwo: (value) => {
                const n = Number(value);
                return n === 1 || n === 2 || "Debe ser 1 o 2";
              },
            },
          })}
        />

      </div>

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
                  validate: (value) => {
                    const integerResult = validateIntegerNumber(value);
                    if (integerResult !== true) return integerResult;
                    return validatePositiveNumber(value, false);
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
                  validate: (value) => {
                    const integerResult = validateIntegerNumber(value);
                    if (integerResult !== true) return integerResult;
                    const nonNegativeResult = validatePositiveNumber(value, true);
                    if (nonNegativeResult !== true) return nonNegativeResult;
                    if (Number(value) < Number(minEvidenceCount)) {
                      return "La evidencia máxima debe ser mayor o igual a la mínima";
                    }
                    return true;
                  },
                })}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          size="giant"
          label="Cancelar"
          disabled={isPending}
          className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          onClick={onCancel}
        />
        <Button
          type="submit"
          size="giant"
          label="Registrar política"
          disabled={!isValid || isPending}
          className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        />
      </div>
    </form>
  );
}
