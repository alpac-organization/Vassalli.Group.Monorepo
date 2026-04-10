import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditableFieldForm";
import { currencyRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/currency-utils";
import { salaryTypeRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/salary-utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatIsoString } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { useUpdateWorkInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/update-work-utils"; // <-- Importamos nuestro hook
import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { WorkInformationProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/types/work-information.type";

const defaultInformationWork: WorkFormData = {
  entry_date: "",
  jobPosition: "",
  workArea: "",
  workEmail: "",
  workPhoneNumber: "",
  inssNumber: "",
  bankAccountNumber: "",
  bankName: "",
  branchName: "",
  salary_information: {
    salaryAmount: "",
    currency: "",
    salaryType: "",
  },
};

export const WorkManagementSection = ({ profile }: WorkInformationProps) => {
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
  // const permissions = {
  //   canEditWork: role === "admin" || role === "administrador", // Ajusta el string según tu base de datos
  // };

  const formValuesWorkInformation = useMemo(() => {
    if (!profile) return defaultInformationWork;
    const w = profile.working_information;
    const s = profile.salary_information;

    return {
      entry_date: formatIsoString(w?.entry_date as string | null),
      jobPosition: w?.work_position ?? "",
      workArea: w?.work_area ?? "",
      workEmail: w?.work_email ?? "",
      workPhoneNumber: w?.work_phone_number ?? "",
      inssNumber: w?.inss_number ?? "",
      bankAccountNumber: w?.bank_account_number ?? "",
      bankName: w?.bank_name ?? "",
      branchName: w?.branch_name ?? "",
      salaryAmount: s?.salary != null ? String(s.salary) : "",
      currency: currencyRawToLabel(s?.currency as string | null) ?? "",
      salaryType: salaryTypeRawToLabel(s?.salary_type as string | null) ?? "",
    };
  }, [profile]);

  const formMethods = useForm<WorkFormData>({
    mode: "onChange",
    defaultValues: defaultInformationWork,
    values: formValuesWorkInformation,
    resetOptions: { keepDirty: true },
  });

  const { handleFieldUpdate, alertInfo, setAlertInfo } =
    useUpdateWorkInformation({
      companyId,
      moduleCode,
      targetIdentification,
    });

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const editableFieldInputClasses = "text-[14px]! font-medium! ml-0.5!";
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

      <div className="w-full max-w-full mb-8">
        <section className="w-full dark:bg-[#272b34] bg-white border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col gap-8 sm:gap-10">
            <div className="min-w-0">
              <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <EditableField
                  name="workArea"
                  label="Área de Trabajo"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.workArea)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Área de trabajo no registrada"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="jobPosition"
                  label="Posición / Cargo"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.jobPosition)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Cargo no registrado"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="workPhoneNumber"
                  label="Teléfono de Trabajo"
                  type="tel"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.workPhoneNumber)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={currentRole === "Operator"}
                  missingMessage="Teléfono de trabajo no registrado"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="entry_date"
                  label="Fecha de Inicio"
                  type="date"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.entry_date)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Fecha de inicio no registrada"
                  className={editableFieldInputClasses}
                />

                <div className="min-w-0 sm:col-span-2 lg:col-span-2">
                  <EditableField
                    name="workEmail"
                    label="Correo de Trabajo"
                    type="email"
                    formMethods={formMethods}
                    isEditing={Boolean(editingFields.workEmail)}
                    onEditStart={handleEditStart}
                    onEditEnd={handleEditEnd}
                    onConfirmUpdate={handleFieldUpdate}
                    allowEdit={currentRole === "Operator"}
                    missingMessage="Correo de trabajo no registrado"
                    className={editableFieldInputClasses}
                  />
                </div>

                <EditableField
                  name="inssNumber"
                  label="Número de INSS"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.inssNumber)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="INSS no registrado"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="branchName"
                  label="Sucursal"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.branchName)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Sucursal no registrada"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="bankAccountNumber"
                  label="Cuenta Bancaria (Nómina)"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.bankAccountNumber)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Cuenta bancaria no registrada"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="bankName"
                  label="Banco"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.bankName)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Banco no registrado"
                  className={editableFieldInputClasses}
                />
              </div>
            </div>

            {/* SECCIÓN: INFORMACIÓN SALARIAL */}
            <div className="min-w-0 border-t border-slate-200 dark:border-neutral-600 pt-6 sm:pt-8">
              <h3 className="text-[18px]! font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-8 sm:mb-5">
                Información salarial
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <EditableField
                  name="salaryAmount"
                  label="Salario"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.salaryAmount)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Salario no registrado"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="currency"
                  label="Moneda"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.currency)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Moneda no registrada"
                  className={editableFieldInputClasses}
                />

                <EditableField
                  name="salaryType"
                  label="Tipo de salario"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.salaryType)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={handleFieldUpdate}
                  allowEdit={false}
                  missingMessage="Tipo de salario no registrado"
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
