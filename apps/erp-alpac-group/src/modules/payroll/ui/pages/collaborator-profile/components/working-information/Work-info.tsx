import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { Alert, AnimatedAlertWrapper, InputText } from "@alpac/design-system";
import { Pencil } from "lucide-react";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditableFieldForm";
import { currencyRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/currency-utils";
import { salaryTypeRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/salary-utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatIsoString } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { useUpdateWorkInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/update-work-utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { WorkInformationProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/types/work-information.type";
import {
  validateEmail,
  validateNicaraguaPhone,
  formatPhone,
} from "@app/shared/utils/string.utils";
import { normalizeMaritalStatusFromApi } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import { BranchSelectModal } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/branch-select-modal";

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
  salaryAmount: "",
  currency: "",
  salaryType: "",
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
  const { GetBranchesQuery: branchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );
  const { data: branches = [] } = branchesQuery;

  const formValuesWorkInformation = useMemo(() => {
    if (!profile) return defaultInformationWork;
    const w = profile.working_information;
    const s = profile.salary_information;

    return {
      entry_date: formatIsoString(w?.entry_date as string | null),
      jobPosition: w?.work_position ?? "",
      workArea: w?.work_area ?? "",
      workEmail: w?.work_email ?? "",
      workPhoneNumber: formatPhone(w?.work_phone_number ?? ""),
      inssNumber: w?.inss_number ?? "",
      bankAccountNumber: w?.bank_account_number ?? "",
      bankName: w?.bank_name ?? "",
      branchName: w?.branch_name ?? "",
      salaryAmount: s?.salary != null ? String(s.salary) : "",
      currency: currencyRawToLabel(s?.currency as string | null) ?? "",
      salaryType: salaryTypeRawToLabel(s?.salary_type as string | null) ?? "",
    };
  }, [profile]);

  const resolvedMaritalStatusCode = useMemo(
    () =>
      normalizeMaritalStatusFromApi(
        profile?.personal_information?.marital_status ?? null,
      ),
    [profile?.personal_information?.marital_status],
  );

  const formMethods = useForm<WorkFormData>({
    mode: "onChange",
    defaultValues: defaultInformationWork,
    values: formValuesWorkInformation,
    resetOptions: { keepDirty: true },
  });

  const { handleFieldUpdate, alertInfo, setAlertInfo, isUpdating } =
    useUpdateWorkInformation({
      companyId,
      moduleCode,
      targetIdentification,
      resolvedMaritalStatusCode,
    });
  const { watch, setValue } = formMethods;

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const editableFieldInputClasses = "text-[14px]! font-medium! ml-0.5!";
  const baseInputClasses = `transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3!
                            focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
                            disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
                            min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!`;
  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: String(branch.branch_id),
        label: branch.branch_name,
      })),
    [branches],
  );

  const branchName = watch("branchName");
  const branchMissing = isValueMissing(branchName);
  const currentBranchId = useMemo(() => {
    const matchingBranch = branchOptions.find(
      (option) => option.label.trim() === String(branchName ?? "").trim(),
    );
    return matchingBranch?.value ?? null;
  }, [branchName, branchOptions]);

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
      <BranchSelectModal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        currentBranchId={currentBranchId}
        options={branchOptions}
        isSaving={isUpdating}
        onConfirm={async (branchId, branchLabel) => {
          await handleFieldUpdate("branchId", branchId);
          setValue("branchName", branchLabel, { shouldDirty: true });
        }}
      />

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
                  onConfirmUpdate={async (name, value) => {
                    const cleanValue = value.replace(/-/g, "");
                    await handleFieldUpdate(name, cleanValue);
                  }}
                  allowEdit={
                    currentRole === "Administrator" ||
                    currentRole === "Operator"
                  }
                  missingMessage="Teléfono de trabajo no registrado"
                  className={editableFieldInputClasses}
                  validation={{
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatPhone(e.target.value);
                      formMethods.setValue("workPhoneNumber", formatted, {
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
                    allowEdit={
                      currentRole === "Operator" ||
                      currentRole === "Administrator"
                    }
                    missingMessage="Correo de trabajo no registrado"
                    className={editableFieldInputClasses}
                    validation={{ validate: validateEmail }}
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

                <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
                  <div className="flex min-w-0 items-start gap-2 sm:gap-2.5">
                    <div className="min-w-0 flex-1 relative">
                      <InputText
                        label="Sucursal"
                        labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                        disabled
                        value={
                          branchMissing ? "Sucursal no registrada" : branchName
                        }
                        className={`${baseInputClasses} ${branchMissing ? missingDataInInputClassName : "text-white! dark:text-white!"}`}
                      />
                    </div>
                    {(currentRole === "Administrator" ||
                      currentRole === "Manager") && (
                      <div className="flex shrink-0 gap-2 mt-[24px] sm:mt-[26px]">
                        <button
                          type="button"
                          title="Cambiar sucursal"
                          onClick={() => setBranchModalOpen(true)}
                          className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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
                  displayFormat={(value) => {
                    if (!value) return "";
                    const currencyLabel = formMethods.watch("currency");
                    const currencyCode =
                      currencyLabel === "Dólares" ? "USD" : "NIO";
                    return formatCurrency(Number(value), currencyCode);
                  }}
                />

                <EditableField
                  name="currency"
                  label="Moneda"
                  type="text"
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
