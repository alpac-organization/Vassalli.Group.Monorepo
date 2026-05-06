import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { Pencil } from "lucide-react";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditableFieldForm";
import {
  missingDataInInputClassName,
  isValueMissing,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { PersonalInformationProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/personal-information.type";
import { mapPersonalInformationToForm } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/mapPersonalInformationToForm";
import { splitFullNameForForm } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/split-full-name";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DepartmentSelectModal } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/department-select-modal";
import { MaritalStatusSelectModal } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/marital-status-select-modal";
import {
  maritalRawToLabel,
  normalizeMaritalStatusFromApi,
  type MaritalStatusSource,
} from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";
import { useUpdatePersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/updateInformation";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import {
  validateIdentificationNumber,
  formatIdentificationNumber,
  validateEmail,
  validateNicaraguaPhone,
  validateTextNoDigits,
  formatPhone,
} from "@app/shared/utils/string.utils";

const defaultPersonalInformation: PersonalFormData = {
  identification_number: "",
  gender: "",
  marital_status: "",
  birthdate: "",
  address: "",
  personalEmail: "",
  personalPhone: "",
  department_id: "",
  department: "",
};

export const PersonalInformation = ({ profile }: PersonalInformationProps) => {
  const { identification_number: routeIdentification } = useParams();
  const location = useLocation();
  const state = location.state;
  const { companyId, moduleCode, identificationNumber } = useUserStore();

  const targetIdentification = (
    state?.identification_number ??
    routeIdentification ??
    identificationNumber ??
    ""
  ).trim();

  const currentRole = useUserStore().role;
  const formValuesPersonalInformation = useMemo(() => {
    if (!profile) return defaultPersonalInformation;
    const personal = profile.personal_information;
    const names = splitFullNameForForm(profile.full_name ?? "");
    const mapped = mapPersonalInformationToForm(personal);
    return {
      ...defaultPersonalInformation,
      ...mapped,
      ...names,
    };
  }, [profile]);

  const formMethods = useForm<PersonalFormData>({
    mode: "onChange",
    defaultValues: defaultPersonalInformation,
    values: formValuesPersonalInformation,
    resetOptions: { keepDirty: true },
  });

  const { watch, setValue } = formMethods;
  const department_id = watch("department_id");
  const marital_status = watch("marital_status");
  const department_name_watched = watch("department");

  const resolvedMaritalStatusCode = useMemo(() => {
    const fromForm = normalizeMaritalStatusFromApi(marital_status ?? null);
    if (fromForm !== null) return fromForm;
    return normalizeMaritalStatusFromApi(
      profile?.personal_information?.marital_status ?? null,
    );
  }, [marital_status, profile?.personal_information?.marital_status]);

  const { handleFieldUpdate, alertInfo, setAlertInfo, isUpdating } =
    useUpdatePersonalInformation({
      companyId,
      moduleCode,
      targetIdentification,
      resolvedMaritalStatusCode,
    });

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [maritalModalOpen, setMaritalModalOpen] = useState(false);

  const { GetCatalogListQuery } = useCatalog({
    company_id: companyId ?? "",
    catalog_type_id: CatalogEnum.DEPARTMENTS,
  });
  const departmentCatalog = GetCatalogListQuery.data ?? [];

  const departmentDisplayLabel = useMemo(() => {
    const idn = Number(department_id);
    if (idn > 0 && departmentCatalog.length > 0) {
      return (
        departmentCatalog
          .find((d) => d.sub_catalog_id === idn)
          ?.catalog_name.trim() ?? department_name_watched?.trim()
      );
    }
    return (department_name_watched ?? "").trim();
  }, [department_id, department_name_watched, departmentCatalog]);

  const departmentMissing = isValueMissing(department_id);
  const maritalMissing = isValueMissing(marital_status);

  const baseInputClasses = `transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3! 
                            focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
                            disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
                            min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!`;

  return (
    <div className="flex flex-col w-full max-w-full relative min-h-0">
      <AnimatedAlertWrapper open={!!alertInfo}>
        {alertInfo ? (
          <Alert
            type={alertInfo.type}
            title={alertInfo.title}
            message={alertInfo.message}
            showCloseButton
            onClose={() => setAlertInfo(null)}
          />
        ) : null}
      </AnimatedAlertWrapper>

      <DepartmentSelectModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        companyId={companyId ?? ""}
        currentDepartmentSubId={Number(department_id) || null}
        isSaving={isUpdating}
        onConfirm={async (subId, departmentName) => {
          await handleFieldUpdate("department_id", subId);
          setValue("department_id", String(subId), { shouldDirty: true });
          setValue("department", departmentName, { shouldDirty: true });
        }}
      />

      <MaritalStatusSelectModal
        key={marital_status}
        isOpen={maritalModalOpen}
        onClose={() => setMaritalModalOpen(false)}
        currentMaritalStatus={
          String(marital_status ?? "").trim() === ""
            ? 0
            : Number(marital_status) || 0
        }
        isSaving={isUpdating}
        onConfirm={async (status) => {
          await handleFieldUpdate("marital_status", status);
          setValue("marital_status", String(status), { shouldDirty: true });
        }}
      />

      <div className="w-full max-w-full mb-8  dark:border-neutral-700">
        <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <EditableField
                name="identification_number"
                label="Número de Identificación"
                formMethods={formMethods}
                isEditing={editingFields.identification_number}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={async (name, value) => {
                  const cleanValue = value.replace(/-/g, "");
                  await handleFieldUpdate(name, cleanValue);
                }}
                allowEdit={false}
                missingMessage="Número de identificación no registrado"
                className={baseInputClasses}
                validation={{
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatIdentificationNumber(
                      e.target.value,
                    );
                    setValue("identification_number", formatted, {
                      shouldValidate: true,
                    });
                  },
                  validate: (value: string) =>
                    validateIdentificationNumber(
                      value,
                      Number(
                        profile?.personal_information?.identification_type,
                      ),
                    ),
                }}
              />

              <EditableField
                name="gender"
                label="Género"
                formMethods={formMethods}
                isEditing={editingFields.gender}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
                allowEdit={false}
                missingMessage="Género no registrado"
                className={baseInputClasses}
                validation={{ validate: validateTextNoDigits }}
              />

              <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
                <div className="flex min-w-0 items-start gap-2 sm:gap-2.5">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Estado civil"
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled
                      value={
                        maritalMissing
                          ? "Estado civil no registrado"
                          : (maritalRawToLabel(
                              marital_status as MaritalStatusSource,
                            ) ?? "")
                      }
                      className={`${baseInputClasses} ${maritalMissing ? missingDataInInputClassName : "text-white! dark:text-white!"}`}
                    />
                  </div>
                  {(currentRole === "Administrator" ||
                    currentRole === "Operator") && (
                    <div className="flex shrink-0 gap-2 mt-[24px] sm:mt-[26px]">
                      <button
                        type="button"
                        title="Cambiar estado civil"
                        onClick={() => setMaritalModalOpen(true)}
                        className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <EditableField
                name="birthdate"
                label="Fecha de nacimiento"
                type="date"
                formMethods={formMethods}
                isEditing={editingFields.birthdate}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
                allowEdit={false}
                missingMessage="Fecha de nacimiento no registrada"
                className={baseInputClasses}
              />

              <EditableField
                name="personalEmail"
                label="Correo personal"
                type="email"
                formMethods={formMethods}
                isEditing={editingFields.personalEmail}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
                allowEdit={
                  currentRole === "Administrator" || currentRole === "Operator"
                }
                missingMessage="Correo personal no registrado"
                className={baseInputClasses}
                validation={{ validate: validateEmail }}
              />

              <EditableField
                name="personalPhone"
                label="Teléfono personal"
                type="tel"
                formMethods={formMethods}
                isEditing={editingFields.personalPhone}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={async (name, value) => {
                  const cleanValue = value.replace(/-/g, "");
                  await handleFieldUpdate(name, cleanValue);
                }}
                allowEdit={
                  currentRole === "Administrator" || currentRole === "Operator"
                }
                missingMessage="Teléfono personal no registrado"
                className={baseInputClasses}
                validation={{
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatPhone(e.target.value);
                    setValue("personalPhone", formatted, {
                      shouldValidate: true,
                    });
                  },
                  maxLength: {
                    value: 9,
                    message: "El teléfono no puede exceder 8 dígitos",
                  },
                  validate: validateNicaraguaPhone,
                }}
              />

              <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
                <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Departamento"
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled
                      value={
                        departmentMissing
                          ? "Departamento no registrado"
                          : departmentDisplayLabel
                      }
                      className={`${baseInputClasses} ${departmentMissing ? missingDataInInputClassName : "text-white! dark:text-white!"}`}
                    />
                  </div>
                  {/* {(currentRole === "Administrator" ||
                    currentRole === "Operator") && (
                    <div className="flex shrink-0 gap-2 mt-[24px] sm:mt-[26px]">
                      <button
                        type="button"
                        title="Cambiar departamento"
                        onClick={() => setDepartmentModalOpen(true)}
                        className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2 lg:col-span-2">
                <EditableField
                  name="address"
                  label="Dirección exacta"
                  formMethods={formMethods}
                  isEditing={editingFields.address}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={
                    currentRole === "Administrator" ||
                    currentRole === "Operator"
                  }
                  missingMessage="Dirección no registrada"
                  className={baseInputClasses}
                  validation={{ validate: validateTextNoDigits }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
