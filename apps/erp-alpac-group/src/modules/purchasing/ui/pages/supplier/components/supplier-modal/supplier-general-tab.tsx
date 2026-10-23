import { memo, useMemo } from "react";
import { Dropdown, InputText, Textarea } from "@alpac/design-system";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { ConstitutionEnum } from "@app/core/enums/constitution.enum";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import {
  SupplierTypeEnum,
  SupplierTypeOptions,
  type SupplierType,
} from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type {
  UpdateSupplierDetailsPayload,
  UpdateSupplierRequest,
} from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import {
  constitutionStringOptions,
  getIdentificationTypeByConstitution,
  hasConstitutionData,
  identificationStringOptions,
  toIdentificationNumericValue,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/mappers/supplier-modal.mapper";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { isValidateValue } from "@app/shared/utils/values.utils";
import {
  formatIdentificationNumber,
  formatPhone,
  formatRuc,
  validateEmail,
  validateIdentificationNumber,
  validateNicaraguaPhone,
} from "@app/shared/utils/string.utils";

type TrackField = <K extends keyof UpdateSupplierRequest>(
  field: K,
  value: UpdateSupplierRequest[K],
) => void;

type TrackDetailField = <K extends keyof UpdateSupplierDetailsPayload>(
  field: K,
  value: UpdateSupplierDetailsPayload[K],
) => void;

type SupplierGeneralTabProps = {
  control: Control<CreateSupplierRequest>;
  register: UseFormRegister<CreateSupplierRequest>;
  setValue: UseFormSetValue<CreateSupplierRequest>;
  clearErrors: UseFormClearErrors<CreateSupplierRequest>;
  errors: FieldErrors<CreateSupplierRequest>;
  trackField: TrackField;
  trackDetailField: TrackDetailField;
};

export const SupplierGeneralTab = memo(function SupplierGeneralTab({
  control,
  register,
  setValue,
  clearErrors,
  errors,
  trackField,
  trackDetailField,
}: SupplierGeneralTabProps) {
  const constitutionType = useWatch({ control, name: "constitution_type" });
  const identificationType = useWatch({ control, name: "identification_type" });
  const isLegalPerson = constitutionType === ConstitutionEnum.Legal.stringValue;
  const isNaturalPerson =
    constitutionType === ConstitutionEnum.Natural.stringValue;
  const hasIdentificationType = isValidateValue(identificationType);

  const filteredIdentificationTypes = useMemo(() => {
    if (isLegalPerson) {
      return identificationStringOptions.filter(
        (item) => item.value === IdentificationEnum.RUC.stringValue,
      );
    }
    if (isNaturalPerson) {
      return identificationStringOptions.filter(
        (item) => item.value !== IdentificationEnum.RUC.stringValue,
      );
    }
    return identificationStringOptions;
  }, [isLegalPerson, isNaturalPerson]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          Identificación Legal y Comercial
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputText
            label="Razón social"
            placeholder="Ej. Distribuidora del Pacífico S.A."
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("suppliers_legal_name", {
              required: "La razón social es requerida",
              onChange: (evt) => {
                trackField("suppliers_legal_name", evt.target.value);
              },
            })}
            error={errors.suppliers_legal_name?.message}
          />

          <InputText
            label="Nombre comercial (opcional)"
            placeholder="Ej. DIMAC Nicaragua"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("commercial_name", {
              onChange: (evt) => {
                trackField("commercial_name", evt.target.value || null);
              },
            })}
          />

          <Controller
            control={control}
            name="supplier_type"
            rules={{
              required: "El tipo de proveedor es requerido",
            }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de proveedor"
                placeholder="Seleccione..."
                isRequired
                options={SupplierTypeOptions}
                value={field.value ?? null}
                onChange={(value) => {
                  const nextType = (String(value ?? "") ||
                    SupplierTypeEnum.Ordinary.stringValue) as SupplierType;
                  field.onChange(nextType);
                  trackField("supplier_type", nextType);
                  trackDetailField("supplier_type", nextType);
                }}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                valueClassName="text-black! dark:text-white!"
                error={errors.supplier_type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="constitution_type"
            rules={{
              required: "Tipo de constitución es requerido",
              validate: (val) =>
                hasConstitutionData(val) || "Tipo de constitución es requerido",
            }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de constitución"
                placeholder="Seleccione..."
                isRequired
                options={constitutionStringOptions}
                value={field.value || null}
                onChange={(value) => {
                  const nextType = String(value ?? "");
                  const nextIdentificationType =
                    getIdentificationTypeByConstitution(nextType);

                  field.onChange(nextType);
                  setValue(
                    "identification_type",
                    nextIdentificationType || undefined,
                  );
                  setValue("identification_number", "");
                  clearErrors(["identification_number", "identification_type"]);
                  if (hasConstitutionData(nextType)) {
                    trackField("constitution_type", nextType);
                    trackField("identification_type", nextIdentificationType);
                    trackField("identification_number", null);
                  } else {
                    trackField("constitution_type", undefined);
                    trackField("identification_type", null);
                    trackField("identification_number", null);
                  }
                }}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                valueClassName="text-black! dark:text-white!"
                error={errors.constitution_type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="identification_type"
            rules={{
              required: "El tipo de identificación es requerido",
              validate: (val) =>
                isValidateValue(val) || "El tipo de identificación es requerido",
            }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de identificación"
                placeholder="Seleccione..."
                isRequired
                disabled={!hasConstitutionData(constitutionType)}
                options={filteredIdentificationTypes}
                value={field.value ?? null}
                onChange={(value) => {
                  const nextType = String(value ?? "");
                  field.onChange(nextType);
                  setValue("identification_number", "");
                  clearErrors("identification_number");
                  trackField("identification_type", nextType);
                }}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                valueClassName="text-black! dark:text-white!"
                error={errors.identification_type?.message}
              />
            )}
          />

          <div className="md:col-span-2">
            <InputText
              label="Número de identificación"
              placeholder={
                isLegalPerson
                  ? "Ej. J0310000045678"
                  : identificationType === IdentificationEnum.PASSPORT.stringValue
                    ? "Ej. A1234567"
                    : "Ej. 001-150885-0012X"
              }
              isRequired
              className={inputClassName}
              labelClassName={labelClassName}
              disabled={
                !hasConstitutionData(constitutionType) || !hasIdentificationType
              }
              {...register("identification_number", {
                setValueAs: (value: string) =>
                  value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                validate: {
                  required: (value?: string | null) =>
                    Boolean(value?.trim()) ||
                    "El número de identificación es requerido",
                  validIdentification: (value?: string | null) => {
                    if (!value?.trim()) return true;

                    if (isNaturalPerson) {
                      return validateIdentificationNumber(
                        value,
                        toIdentificationNumericValue(identificationType),
                      );
                    }
                    if (isLegalPerson) {
                      const clean = value.replace(/-/g, "");
                      return (
                        /^[A-Z]\d{13}$/.test(clean) ||
                        "El RUC debe iniciar con letra y tener 14 caracteres"
                      );
                    }
                    return true;
                  },
                },
                onChange: (evt) => {
                  if (isLegalPerson) {
                    evt.target.value = formatRuc(evt.target.value);
                  } else if (
                    isNaturalPerson &&
                    identificationType ===
                      IdentificationEnum.NATIONAL_ID.stringValue
                  ) {
                    evt.target.value = formatIdentificationNumber(
                      evt.target.value,
                    );
                  }
                  trackField(
                    "identification_number",
                    String(evt.target.value ?? "")
                      .replace(/-/g, "")
                      .toUpperCase(),
                  );
                },
              })}
              error={errors.identification_number?.message}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          Información de Contacto
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputText
            label="Nombre de contacto"
            placeholder="Ej. Carlos Mendoza"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("supplier_details.contact_name", {
              onChange: (evt) =>
                trackDetailField("contact_name", evt.target.value),
            })}
            error={errors.supplier_details?.contact_name?.message}
          />

          <InputText
            label="Teléfono de contacto"
            placeholder="Ej. 8888-8888"
            type="tel"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("supplier_details.contact_phone_number", {
              onChange: (evt) => {
                evt.target.value = formatPhone(evt.target.value);
                trackDetailField("contact_phone_number", evt.target.value);
              },
              validate: (value) => !value || validateNicaraguaPhone(value),
            })}
            error={errors.supplier_details?.contact_phone_number?.message}
          />

          <InputText
            label="Correo de contacto"
            placeholder="Ej. ventas@proveedor.com"
            type="email"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("supplier_details.contact_email", {
              setValueAs: (value: string) => value?.trim(),
              validate: {
                validEmail: (value?: string | null) =>
                  validateEmail(value ?? undefined),
              },
              onChange: (evt) =>
                trackDetailField("contact_email", evt.target.value?.trim()),
            })}
            error={errors.supplier_details?.contact_email?.message}
          />

          <InputText
            label="Correo de soporte"
            placeholder="Ej. soporte@proveedor.com"
            type="email"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("supplier_details.email_support", {
              setValueAs: (value: string) => value?.trim(),
              validate: {
                validEmail: (value?: string | null) =>
                  validateEmail(value ?? undefined),
              },
              onChange: (evt) =>
                trackDetailField("email_support", evt.target.value?.trim()),
            })}
            error={errors.supplier_details?.email_support?.message}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Dirección física"
              placeholder="Ej. Km 6.5 Carretera Norte, frente a Enatrel, Managua"
              className={inputClassName}
              labelClassName={labelClassName}
              {...register("supplier_details.address", {
                onChange: (evt) => trackDetailField("address", evt.target.value),
              })}
              error={errors.supplier_details?.address?.message}
              maxLength={500}
              style={{
                resize: "none",
                height: "90px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
