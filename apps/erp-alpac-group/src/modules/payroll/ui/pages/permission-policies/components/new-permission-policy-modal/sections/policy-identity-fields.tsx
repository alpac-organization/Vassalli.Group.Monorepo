import { useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Dropdown } from "@alpac/design-system";
import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import {
  FAMILY_ONLY_PERMIT_TYPES,
  HIDDEN_PERMIT_TYPES,
  dropdownClassName,
  labelClassName,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/constants/permission-policy-form.constants";
import { validateFamilyRelationship } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/utils/permission-policy-field-rules";
import type { PermissionPolicyFormValues } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

type PolicyIdentityFieldsProps = {
  permitTypes: CatalogItem[];
  beneficiaryScopes: CatalogItem[];
  familyRelationships: CatalogItem[];
};

export function PolicyIdentityFields({
  permitTypes,
  beneficiaryScopes,
  familyRelationships,
}: PolicyIdentityFieldsProps) {
  const { control, setValue, clearErrors, trigger } =
    useFormContext<PermissionPolicyFormValues>();

  const permitApplicationType = useWatch({
    control,
    name: "permit_application_type",
  });
  const beneficiaryScope = useWatch({
    control,
    name: "permit_beneficiary_scope",
  });

  const isFamilyNucleus = beneficiaryScope === "FamilyNucleus";
  const hideOwnScope = FAMILY_ONLY_PERMIT_TYPES.has(permitApplicationType);

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

  return (
    <>
      <Controller
        name="permit_application_type"
        control={control}
        rules={{ required: "Seleccione el tipo de permiso" }}
        render={({ field, fieldState }) => (
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
                setValue("family_relationship", "None");
                clearErrors("family_relationship");
              }
            }}
            options={permitTypeOptions}
            isRequired
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={dropdownClassName}
            error={fieldState.error?.message}
            errorVariant="tooltip"
          />
        )}
      />

      <Controller
        name="permit_beneficiary_scope"
        control={control}
        rules={{ required: "Seleccione el alcance del beneficiario" }}
        render={({ field, fieldState }) => (
          <Dropdown
            label="Alcance "
            appearance="dark"
            placeholder="Seleccione un alcance"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              if (value !== "FamilyNucleus") {
                setValue("family_relationship", "None");
                clearErrors("family_relationship");
              } else {
                void trigger("family_relationship");
              }
            }}
            options={beneficiaryScopeOptions}
            isRequired
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={dropdownClassName}
            error={fieldState.error?.message}
            errorVariant="tooltip"
          />
        )}
      />

      <Controller
        name="family_relationship"
        control={control}
        rules={{
          validate: (value) =>
            validateFamilyRelationship(value, isFamilyNucleus),
        }}
        render={({ field, fieldState }) => (
          <Dropdown
            label="Parentesco"
            appearance="dark"
            placeholder="Seleccione un parentesco"
            value={
              isFamilyNucleus && field.value !== "None" ? field.value : ""
            }
            onChange={(value) => {
              field.onChange(value);
              if (value && value !== "None") {
                clearErrors("family_relationship");
              }
            }}
            options={familyRelationshipOptions}
            disabled={!isFamilyNucleus}
            isRequired={isFamilyNucleus}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={dropdownClassName}
            error={fieldState.error?.message}
            errorVariant="tooltip"
          />
        )}
      />
    </>
  );
}
