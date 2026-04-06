import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { WorkInformationProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/types/work-information.type";
import { ReadonlyWorkField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/ReadonlyWorkField";

import { currencyRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/currencyRawToLabel";
import { salaryTypeRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/utils/salaryTypeRawToLabel";

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
  const formMethods = useForm<WorkFormData>({
    mode: "onChange",
    defaultValues: defaultInformationWork,
  });

  const { reset, register, watch } = formMethods;

  useEffect(() => {
    if (!profile) return;
    const w = profile.working_information;
    const s = profile.salary_information;
    reset({
      entry_date: w.entry_date ?? undefined,
      jobPosition: w.work_position ?? "",
      workArea: w.work_area ?? "",
      workEmail: w.work_email ?? "",
      workPhoneNumber: w.work_phone_number ?? "",
      inssNumber: w.inss_number ?? "",
      bankAccountNumber: w.bank_account_number ?? "",
      bankName: w.bank_name ?? "",
      branchName: w.branch_name ?? "",
      salaryAmount: s.salary != null ? String(s.salary) : "",
      currency: currencyRawToLabel(s.currency),
      salaryType: salaryTypeRawToLabel(s.salary_type),
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
                register={register}
                watch={watch}
                missingLabel="Área de trabajo no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="jobPosition"
                label="Posición / Cargo"
                register={register}
                watch={watch}
                missingLabel="Cargo no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="workPhoneNumber"
                label="Teléfono de Trabajo"
                register={register}
                watch={watch}
                missingLabel="Teléfono de trabajo no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
                type="tel"
              />
              <ReadonlyWorkField
                name="entry_date"
                label="Fecha de Inicio"
                register={register}
                watch={watch}
                missingLabel="Fecha de inicio no registrada"
                type="date"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <div className="min-w-0 sm:col-span-2 lg:col-span-2">
                <ReadonlyWorkField
                  name="workEmail"
                  label="Correo de Trabajo"
                  register={register}
                  watch={watch}
                  missingLabel="Correo de trabajo no registrado"
                  type="email"
                  readOnlyInputClasses={readOnlyInputClasses}
                />
              </div>
              <ReadonlyWorkField
                name="inssNumber"
                label="Número de INSS"
                register={register}
                watch={watch}
                missingLabel="INSS no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="bankAccountNumber"
                label="Cuenta Bancaria (Nómina)"
                register={register}
                watch={watch}
                missingLabel="Cuenta bancaria no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="bankName"
                label="Banco"
                register={register}
                watch={watch}
                missingLabel="Banco no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="branchName"
                label="Sucursal"
                register={register}
                watch={watch}
                missingLabel="Sucursal no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="salaryAmount"
                label="Salario"
                register={register}
                watch={watch}
                missingLabel="Salario no registrado"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="currency"
                label="Moneda"
                register={register}
                watch={watch}
                missingLabel="Moneda no registrada"
                readOnlyInputClasses={readOnlyInputClasses}
              />
              <ReadonlyWorkField
                name="salaryType"
                label="Tipo de salario"
                register={register}
                watch={watch}
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
