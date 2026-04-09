import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { Pencil } from "lucide-react";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditableField";
import { missingDataInInputClassName } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { PersonalInformationProps } from "./types/personal-information.type";
import { mapPersonalInformationToForm } from "./utils/mapPersonalInformationToForm";
import { splitFullNameForForm } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/split-full-name";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CollaboratorProfileLocationState } from "@app/modules/payroll/ui/pages/collaborator-profile/types/collaborator-profile-navigation.types";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { DepartmentSelectModal } from "./department-select-modal";
import { MaritalStatusSelectModal } from "./marital-status-select-modal";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { maritalRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/maritalRawToLabel";
import { isValidMaritalStatusCode } from "./utils/normalizeMaritalStatusFromApi";

const defaultPersonalInformation: PersonalFormData = {
  identification_number: "",
  gender: "",
  marital_status: "",
  birthdate: "",
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  address: "",
  personalEmail: "",
  personalPhone: "",
  department_id: "",
  departament: "",
};

export const PersonalInformation = ({ profile }: PersonalInformationProps) => {
  const { identification_number: routeIdentification } = useParams();
  const location = useLocation();
  const state = location.state as CollaboratorProfileLocationState | undefined;
  const { companyId, moduleCode, identificationNumber } = useUserStore();

  const targetIdentification = (
    state?.identification_number ??
    routeIdentification ??
    identificationNumber ??
    ""
  ).trim();

  const formMethods = useForm<PersonalFormData>({
    mode: "onChange",
    defaultValues: defaultPersonalInformation,
  });

  const { reset, watch, setValue, getValues } = formMethods;
  const values = watch();

  const lastCollaboratorIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const personal = profile?.personal_information;
    const names = splitFullNameForForm(profile?.full_name ?? "");
    const mapped = mapPersonalInformationToForm(personal);
    const collaboratorId = profile?.collaborator_id;
    const switchedCollaborator =
      collaboratorId !== undefined &&
      collaboratorId !== lastCollaboratorIdRef.current;

    if (switchedCollaborator) {
      lastCollaboratorIdRef.current = collaboratorId;
      reset({
        ...defaultPersonalInformation,
        ...mapped,
        ...names,
      });
      return;
    }

    const prev = getValues();
    const hasDeptFromApi =
      Boolean(mapped.department_id?.trim()) ||
      Boolean(mapped.departament?.trim());

    reset({
      ...defaultPersonalInformation,
      ...mapped,
      ...names,
      ...(!hasDeptFromApi
        ? {
            department_id: prev.department_id,
            departament: prev.departament,
          }
        : {}),
    });
  }, [profile, reset]);

  const { UpdateCollaboratorProfileDetails } = useCollaborators({});

  const { GetCatalogListQuery } = useCatalog({
    company_id: companyId ?? "",
    catalog_type_id: CatalogEnum.DEPARTMENTS,
  });
  const departmentCatalog = GetCatalogListQuery.data ?? [];

  const departmentId = watch("department_id");
  const departmentFallback = watch("departament");
  const departmentDisplayLabel = useMemo(() => {
    const idn = Number(departmentId);
    if (idn > 0 && departmentCatalog.length > 0) {
      const hit = departmentCatalog.find((d) => d.sub_catalog_id === idn);
      if (hit?.catalog_name) return hit.catalog_name.trim();
    }
    return (departmentFallback ?? "").trim();
  }, [departmentId, departmentFallback, departmentCatalog]);

  const departmentMissing = !departmentDisplayLabel;

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [maritalModalOpen, setMaritalModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const handleFieldUpdate = async (
    name: FieldPath<PersonalFormData>,
    value: string,
  ) => {
    if (!companyId?.trim() || !moduleCode?.trim() || !targetIdentification) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: "Falta contexto de empresa o identificación.",
      });
      throw new Error("missing context");
    }

    try {
      const personal: any = {};
      if (name === "personalEmail") personal.personal_email = value;
      else if (name === "personalPhone") personal.personal_phone_number = value;
      else if (name === "address") personal.address = value;
      else return;

      await UpdateCollaboratorProfileDetails.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        identification_number: targetIdentification,
        personal_information: personal,
      });

      setAlertInfo({
        type: "success",
        title: "¡Éxito!",
        message: "El campo se actualizó correctamente.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: getErrorMessage(error) ?? "No se pudo actualizar el campo.",
      });
      throw error;
    }
  };

  const readOnlyInputClasses =
    "disabled:dark:bg-[#1e2229]! text-[14px]! font-medium! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!";

  const editableFieldInputClasses = `
         transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3! focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
         disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
         min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!
      `;
  const currentDeptSubId = useMemo(() => {
    const n = Number(departmentId);
    return n > 0 ? n : null;
  }, [departmentId]);

  const maritalStatusCode = useMemo(() => {
    const n = Number.parseInt(String(values.marital_status ?? ""), 10);
    if (Number.isNaN(n) || !isValidMaritalStatusCode(n)) return 0;
    return n;
  }, [values.marital_status]);

  const isMissing = (val: unknown) =>
    val === undefined || val === null || String(val).trim() === "";
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
        currentDepartmentSubId={currentDeptSubId}
        identificationNumber={targetIdentification}
        moduleCode={moduleCode ?? ""}
        updateMutation={UpdateCollaboratorProfileDetails}
        onDepartmentSaved={(subId, departmentName) => {
          setValue("department_id", String(subId), {
            shouldDirty: true,
            shouldTouch: true,
          });
          setValue("departament", departmentName, {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        onSuccessMessage={() =>
          setAlertInfo({
            type: "success",
            title: "¡Éxito!",
            message: "Departamento actualizado correctamente.",
          })
        }
        onErrorMessage={(msg) =>
          setAlertInfo({ type: "error", title: "Error", message: msg })
        }
      />

      <MaritalStatusSelectModal
        isOpen={maritalModalOpen}
        onClose={() => setMaritalModalOpen(false)}
        companyId={companyId ?? ""}
        currentMaritalStatus={maritalStatusCode}
        identificationNumber={targetIdentification}
        moduleCode={moduleCode ?? ""}
        updateMutation={UpdateCollaboratorProfileDetails}
        onMaritalSaved={(status) => {
          setValue("marital_status", String(status), {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        onSuccessMessage={() =>
          setAlertInfo({
            type: "success",
            title: "¡Éxito!",
            message: "Estado civil actualizado correctamente.",
          })
        }
        onErrorMessage={(msg) =>
          setAlertInfo({ type: "error", title: "Error", message: msg })
        }
      />

      <div className="w-full max-w-full mb-8  dark:border-neutral-700">
        <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputText
                labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.identification_number) ? missingDataInInputClassName : ""}`}
                name="identification_number"
                label="Número de Identificación"
                value={
                  isMissing(values.identification_number)
                    ? "Número de identificación no registrado"
                    : values.identification_number
                }
                disabled
              />

              <InputText
                name="gender"
                label="Género"
                labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                value={
                  isMissing(values.gender)
                    ? "Género no registrado"
                    : values.gender
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.gender) ? missingDataInInputClassName : ""}`}
              />

              <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
                <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Estado civil"
                      labelClassName="text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled
                      value={
                        isMissing(values.marital_status)
                          ? "Estado civil no registrado"
                          : maritalRawToLabel(values.marital_status) ?? ""
                      }
                      className={`transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3! focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20! disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5! ${!isMissing(values.marital_status) ? "text-white! dark:text-white! disabled:dark:text-slate-200!" : ""} ${isMissing(values.marital_status) ? missingDataInInputClassName : ""}`}
                    />
                  </div>
                  <button
                    type="button"
                    title="Cambiar estado civil"
                    onClick={() => setMaritalModalOpen(true)}
                    className="h-[42px] w-[42px] sm:h-12 sm:w-12 flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>

              <InputText
                name="firstName"
                label="Primer nombre"
                labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                value={
                  isMissing(values.firstName)
                    ? "Primer nombre no registrado"
                    : values.firstName
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.firstName) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                name="secondName"
                label="Segundo nombre"
                labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                value={
                  isMissing(values.secondName)
                    ? "Segundo nombre no registrado"
                    : values.secondName
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.secondName) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                name="firstLastName"
                label="Primer apellido"
                labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                value={
                  isMissing(values.firstLastName)
                    ? "Primer apellido no registrado"
                    : values.firstLastName
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.firstLastName) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                name="secondLastName"
                label="Segundo apellido"
                labelClassName="text-[14px]! font-medium! text-white! ml-0.5!"
                value={
                  isMissing(values.secondLastName)
                    ? "Segundo apellido no registrado"
                    : values.secondLastName
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.secondLastName) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                name="birthdate"
                label="Fecha de nacimiento"
                labelClassName="text-[14px]! font-medium! text-white! ml-0.5!"
                type="date"
                value={
                  isMissing(values.birthdate)
                    ? "Fecha de nacimiento no registrada"
                    : values.birthdate
                }
                disabled
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isMissing(values.birthdate) ? missingDataInInputClassName : ""}`}
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
                formatDisplayValue={(val) =>
                  isMissing(val) ? "Correo personal no registrado" : val
                }
                className={editableFieldInputClasses}
              />

              <EditableField
                name="personalPhone"
                label="Teléfono personal"
                type="tel"
                formMethods={formMethods}
                isEditing={editingFields.personalPhone}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
                formatDisplayValue={(val) =>
                  isMissing(val) ? "Teléfono personal no registrado" : val
                }
                className={editableFieldInputClasses}
              />

              <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
                <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Departamento"
                      labelClassName="text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled
                      value={
                        departmentMissing
                          ? "Departamento no registrado"
                          : departmentDisplayLabel
                      }
                      className={`transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3! focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5! ${!departmentMissing ? "text-white! dark:text-white! disabled:dark:text-slate-200!" : ""} ${departmentMissing ? missingDataInInputClassName : ""}`}
                    />
                  </div>
                  {/* <button
                       type="button"
                      title="Cambiar departamento"
                      onClick={() => setDepartmentModalOpen(true)}
                       className="h-[42px] w-[42px] sm:h-12 sm:w-12 flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                              >
                      <Pencil size={16} />
                      </button> */}
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
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Dirección no registrada" : val
                  }
                  className={editableFieldInputClasses}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
