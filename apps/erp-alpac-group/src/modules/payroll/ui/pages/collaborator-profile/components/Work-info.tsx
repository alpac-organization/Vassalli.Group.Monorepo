import { useEffect } from "react";
import type { Control } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import type { WorkFormData } from "../types/profile-details.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "./field-missing-message";

const defaultInformationWork: WorkFormData = {
  startDate: "",
  jobPosition: "",
  workArea: "",
  workEmail: "",
  inssNumber: "",
  bankAccountNumber: "",
  bankName: "",
  branchName: "",
  salaryAmount: "",
  currency: "",
  salaryType: "",
};

export type WorkManagementSectionProps = {
  profile?: GetCollaboratorProfileDetailsResponse | null;
};

type ReadonlyWorkFieldProps = {
  name: keyof WorkFormData;
  label: string;
  control: Control<WorkFormData>;
  missingLabel: string;
  type?: "text" | "email" | "date";
  readOnlyInputClasses: string;
};

function ReadonlyWorkField({
  name,
  label,
  control,
  missingLabel,
  type = "text",
  readOnlyInputClasses,
}: ReadonlyWorkFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const missing = isValueMissing(field.value);
        const inputType = missing ? "text" : type;
        return (
          <InputText
            label={label}
            labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
            type={inputType}
            disabled
            editable={false}
            value={missing ? missingLabel : String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${missing ? missingDataInInputClassName : ""}`}
          />
        );
      }}
    />
  );
}

export const WorkManagementSection = ({
  profile,
}: WorkManagementSectionProps) => {
  const { reset, control } = useForm<WorkFormData>({
    defaultValues: defaultInformationWork,
  });

  useEffect(() => {
    if (!profile) return;
    const w = profile.working_information;
    const s = profile.salary_information;
    reset({
      startDate: "",
      jobPosition: w.work_position ?? "",
      workArea: w.work_area ?? "",
      workEmail: "",
      inssNumber: w.inss_number ?? "",
      bankAccountNumber: w.bank_account_number ?? "",
      bankName: w.bank_name ?? "",
      branchName: w.branch_name ?? "",
      salaryAmount: s.salary != null ? String(s.salary) : "",
      currency: s.currency ?? "",
      salaryType: s.salary_type ?? "",
    });
  }, [profile, reset]);

  const readOnlyInputClasses =
    "disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!";

  return (
    <div className="flex flex-col w-full max-w-full min-h-0">
      <div className="w-full max-w-full mb-8">
        <section className="w-full dark:bg-[#272b34] bg-white rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ReadonlyWorkField
                name="workArea"
                label="Área de Trabajo"
                control={control}
                missingLabel="Área de trabajo no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="jobPosition"
                label="Posición / Cargo"
                control={control}
                missingLabel="Cargo no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="startDate"
                label="Fecha de Inicio"
                control={control}
                missingLabel="Fecha de inicio no registrada"
                type="date"
                readOnlyInputClasses={readOnlyInputClasses}
              />

              <div className="min-w-0 sm:col-span-2 lg:col-span-2">
                <ReadonlyWorkField
                  name="workEmail"
                  label="Correo de Trabajo"
                  control={control}
                  missingLabel="Correo de trabajo no registrado"
                  type="email"
                  readOnlyInputClasses={readOnlyInputClasses}
                />
              </div>

              <ReadonlyWorkField
                name="inssNumber"
                label="Número de INSS"
                control={control}
                missingLabel="Número de INSS no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="bankAccountNumber"
                label="Cuenta bancaria"
                control={control}
                missingLabel="Cuenta bancaria no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="bankName"
                label="Banco"
                control={control}
                missingLabel="Banco no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="branchName"
                label="Sucursal"
                control={control}
                missingLabel="Sucursal no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="salaryAmount"
                label="Salario"
                control={control}
                missingLabel="Salario no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="currency"
                label="Moneda"
                control={control}
                missingLabel="Moneda no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="salaryType"
                label="Tipo de salario"
                control={control}
                missingLabel="Tipo de salario no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
