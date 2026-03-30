import { useForm } from "react-hook-form";
import {
  Briefcase,
  Calendar,
  CreditCard,
  Building,
  Shield,
} from "lucide-react";
import { InputText } from "@alpac/design-system";
import type { WorkFormData } from "../types/profile-details.types";

const readOnlyInputClasses =
  "!h-[42px] disabled:dark:!bg-[#1e2229] disabled:dark:!text-slate-200 disabled:dark:!border-slate-700/50 disabled:!px-3 disabled:!opacity-100 disabled:!shadow-none disabled:!font-medium";

export const WorkManagementSection = () => {
  const { register } = useForm<WorkFormData>({
    defaultValues: {
      startDate: "2023-01-15",
      jobPosition: "Desarrollador Frontend",
      workArea: "Tecnología",
      workEmail: "luis.garcia@empresa.com",
      inssNumber: "000000000",
      bankAccountNumber: "1234567890 (BAC)",
    },
  });

  return (
    <div className="flex flex-col w-full max-w-full min-h-0">
      <div className="w-full max-w-full mb-8">
        <section className="w-full dark:bg-[#272b34] bg-white rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 w-full flex-col gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Building className="h-3 w-3 shrink-0 text-blue-500" />
                  Área de Trabajo
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("workArea")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Briefcase className="h-3 w-3 shrink-0 text-blue-500" />
                  Posición / Cargo
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("jobPosition")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Calendar className="h-3 w-3 shrink-0 text-blue-500" />
                  Fecha de Inicio
                </label>
                <InputText
                  type="date"
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("startDate")}
                />
              </div>

              <div className="flex min-w-0 w-full flex-col gap-2 lg:col-span-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-teal-500" />
                  Correo de Trabajo
                </label>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                  <InputText
                    type="email"
                    disabled
                    editable={false}
                    className={`${readOnlyInputClasses} min-w-0 flex-1`}
                    {...register("workEmail")}
                  />
                  <span className="shrink-0 self-start rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-600 whitespace-nowrap sm:self-center dark:text-teal-400">
                    Activo
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 w-full flex-col gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Shield className="h-3 w-3 shrink-0 text-emerald-500" />
                  Número de INSS
                </label>
                <div className="flex min-w-0 items-center gap-2">
                  <InputText
                    disabled
                    editable={false}
                    className={`${readOnlyInputClasses} min-w-0 flex-1`}
                    {...register("inssNumber")}
                  />
                  <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2">
                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <CreditCard className="h-3 w-3 shrink-0 text-emerald-500" />
                  Cuenta Bancaria (Nómina)
                </label>
                <div className="flex min-w-0 items-center gap-2">
                  <InputText
                    disabled
                    editable={false}
                    className={`${readOnlyInputClasses} min-w-0 flex-1`}
                    {...register("bankAccountNumber")}
                  />
                  <div className="shrink-0 rounded-lg bg-blue-500/10 p-2">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
