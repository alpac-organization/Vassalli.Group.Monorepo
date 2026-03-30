import { useForm } from "react-hook-form";
import {
  Briefcase,
  Mail,
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
      <div className="w-full max-w-full space-y-6 mb-8">
        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/10">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                {/* <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                </h3> */}
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Información Laboral
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-blue-500" />
                  Área de Trabajo
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("workArea")}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-blue-500" />
                  Posición / Cargo
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("jobPosition")}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-blue-500" />
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
            </div>
          </div>
        </section>

        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 dark:bg-teal-500/10">
                <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                {/* <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                </h3> */}
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Contacto Corporativo
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-teal-500" />
                Correo de Trabajo
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full min-w-0">
                <InputText
                  type="email"
                  disabled
                  editable={false}
                  className={`${readOnlyInputClasses} w-full min-w-0 flex-1`}
                  {...register("workEmail")}
                />
                <span className="px-3 py-1.5 text-xs font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/20 whitespace-nowrap shrink-0 self-start sm:self-center">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                {/* <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                </h3> */}
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Información Financiera y Seguridad Social
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  Número de INSS
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    disabled
                    editable={false}
                    className={readOnlyInputClasses}
                    {...register("inssNumber")}
                  />
                  <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-emerald-500" />
                  Cuenta Bancaria (Nómina)
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    disabled
                    editable={false}
                    className={readOnlyInputClasses}
                    {...register("bankAccountNumber")}
                  />
                  <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
