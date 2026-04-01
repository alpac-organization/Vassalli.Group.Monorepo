import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import { ReadonlyWorkField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/ReadonlyWorkField";

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

export const WorkManagementSection = ({
  profile,
}: WorkManagementSectionProps) => {
  const formMethods = useForm<WorkFormData>({
    mode: "onChange",
    defaultValues: defaultInformationWork,
  });

  const { reset, control } = formMethods;

  useEffect(() => {
    if (!profile) return;
    const w = profile.working_information;
    const s = profile.salary_information;
    reset({
      startDate: "",
      jobPosition: w.work_position ?? profile.work_position ?? "",
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
    <div className="flex flex-col w-full max-w-full relative min-h-0">
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
                missingLabel="INSS no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="bankAccountNumber"
                label="Cuenta Bancaria (Nómina)"
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
