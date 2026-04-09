import { useEffect, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { WorkInformationProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/types/work-information.type";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditableField";
import { currencyRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/currencyRawToLabel";
import { salaryTypeRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/salaryTypeRawToLabel";
import { workFieldAllowEdit } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/workFieldAllowEdit";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CollaboratorProfileLocationState } from "@app/modules/payroll/ui/pages/collaborator-profile/types/collaborator-profile-navigation.types";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import type {
  UpdateCollaboratorProfileDetailsRequest,
  UpdateSalaryInformationRequest,
  UpdateWorkingInformationRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";
import { salaryTypeLabelToApiValue } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/salaryTypeRawToLabel";
import { currencyLabelToApiCode } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/currencyRawToLabel";
import { formatIsoString } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
const defaultInformationWork: WorkFormData = {
  entry_date: undefined,
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
  const state = location.state as CollaboratorProfileLocationState | undefined;
  const { companyId, moduleCode, identificationNumber, role } = useUserStore();

  const targetIdentification = (
    state?.identification_number ??
    routeIdentification ??
    identificationNumber ??
    ""
  ).trim();

  const formMethods = useForm<WorkFormData>({
    mode: "onChange",
    defaultValues: defaultInformationWork,
  });

  const { reset } = formMethods;

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const { UpdateCollaboratorProfileDetails } = useCollaborators({});

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  useEffect(() => {
    if (!profile) return;
    const w = profile.working_information;
    const s = profile.salary_information;
    reset({
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
      currency: currencyRawToLabel(s?.currency),
      salaryType: salaryTypeRawToLabel(s?.salary_type),
    });
  }, [profile, reset]);

  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const handleFieldUpdate = async (
    name: FieldPath<WorkFormData>,
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

    const working: UpdateWorkingInformationRequest = {};
    const salary_information: UpdateSalaryInformationRequest = {};

    const parseSalaryNumber = (v: string): number | undefined => {
      const n = Number(String(v).replace(/,/g, "").replace(/\s/g, "").trim());
      return Number.isFinite(n) ? n : undefined;
    };

    const assignIdOrText = (
      raw: string,
      idKey: "work_area_id" | "work_position_id" | "branch_id",
      textKey: "work_area" | "work_position" | "branch_name",
    ) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const asInt = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(asInt) && String(asInt) === trimmed && asInt > 0) {
        working[idKey] = asInt;
      } else {
        working[textKey] = trimmed;
      }
    };

    switch (name) {
      case "workEmail":
        working.work_email = value;
        break;
      case "workPhoneNumber":
        working.work_phone_number = value;
        break;
      case "inssNumber":
        working.inss_number = value;
        break;
      case "bankAccountNumber":
        working.bank_account_number = value;
        break;
      case "workArea":
        assignIdOrText(value, "work_area_id", "work_area");
        break;
      case "jobPosition":
        assignIdOrText(value, "work_position_id", "work_position");
        break;
      case "branchName":
        assignIdOrText(value, "branch_id", "branch_name");
        break;
      case "bankName":
        working.bank_name = value.trim();
        break;
      case "entry_date":
        working.entry_date = value.trim();
        break;
      case "salaryAmount": {
        const n = parseSalaryNumber(value);
        if (n !== undefined) salary_information.salary = n;
        break;
      }
      case "currency": {
        const c = currencyLabelToApiCode(value);
        if (c !== undefined) salary_information.currency = c;
        break;
      }
      case "salaryType": {
        const st = salaryTypeLabelToApiValue(value);
        if (st !== undefined) salary_information.salary_type = st;
        break;
      }
      default:
        return;
    }

    const payload: UpdateCollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: targetIdentification,
    };

    if (Object.keys(working).length > 0) {
      payload.working_information = working;
    }
    if (Object.keys(salary_information).length > 0) {
      payload.salary_information = salary_information;
    }

    if (!payload.working_information && !payload.salary_information) {
      return;
    }

    try {
      await UpdateCollaboratorProfileDetails.mutateAsync(payload);

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

  const editableFieldInputClasses = `
    transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3! focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
    disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
    min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!
  `;

  const isMissing = (val: unknown) =>
    val === undefined || val === null || String(val).trim() === "";

  const allow = (field: keyof WorkFormData) => workFieldAllowEdit(role, field);

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
                  missingMessage="Área de trabajo no registrada"
                  allowEdit={allow("workArea")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Área de trabajo no registrada" : val
                  }
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
                  missingMessage="Cargo no registrado"
                  allowEdit={allow("jobPosition")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Cargo no registrado" : val
                  }
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
                  missingMessage="Teléfono de trabajo no registrado"
                  allowEdit={allow("workPhoneNumber")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Teléfono de trabajo no registrado" : val
                  }
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
                  missingMessage="Fecha de inicio no registrada"
                  allowEdit={allow("entry_date")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Fecha de inicio no registrada" : val
                  }
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
                    missingMessage="Correo de trabajo no registrado"
                    allowEdit={allow("workEmail")}
                    formatDisplayValue={(val) =>
                      isMissing(val) ? "Correo de trabajo no registrado" : val
                    }
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
                  missingMessage="INSS no registrado"
                  allowEdit={allow("inssNumber")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "INSS no registrado" : val
                  }
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
                  missingMessage="Sucursal no registrada"
                  allowEdit={allow("branchName")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Sucursal no registrada" : val
                  }
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
                  missingMessage="Cuenta bancaria no registrada"
                  allowEdit={allow("bankAccountNumber")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Cuenta bancaria no registrada" : val
                  }
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
                  missingMessage="Banco no registrado"
                  allowEdit={allow("bankName")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Banco no registrado" : val
                  }
                  className={editableFieldInputClasses}
                />
              </div>
            </div>

            <div
              className="min-w-0 border-t border-slate-200 dark:border-neutral-600 pt-6 sm:pt-8"
              aria-labelledby="work-info-salary-heading"
            >
              <h3
                id="work-info-salary-heading"
                className="text-[18px]! font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-8 sm:mb-5"
              >
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
                  missingMessage="Salario no registrado"
                  allowEdit={allow("salaryAmount")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Salario no registrado" : val
                  }
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
                  missingMessage="Moneda no registrada"
                  allowEdit={allow("currency")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Moneda no registrada" : val
                  }
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
                  missingMessage="Tipo de salario no registrado"
                  allowEdit={allow("salaryType")}
                  formatDisplayValue={(val) =>
                    isMissing(val) ? "Tipo de salario no registrado" : val
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
