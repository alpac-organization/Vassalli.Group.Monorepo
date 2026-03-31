import { useForm } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import type { WorkFormData } from "../types/profile-details.types";

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
                <InputText
                  label="Área de Trabajo"
                  labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                  disabled
                  editable={false}
                  className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!"
                  {...register("workArea")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <InputText
                  label="Posición / Cargo"
                  labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                  disabled
                  editable={false}
                  className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!"
                  {...register("jobPosition")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <InputText
                  label="Fecha de Inicio"
                  labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                  type="date"
                  disabled
                  editable={false}
                  className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!"
                  {...register("startDate")}
                />
              </div>

              <div className="flex min-w-0 w-full flex-col gap-2 lg:col-span-2">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                  <InputText
                    label="Correo de Trabajo"
                    labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                    type="email"
                    disabled
                    editable={false}
                    className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 flex-1"
                    {...register("workEmail")}
                  />
                </div>
              </div>

              <div className="flex min-w-0 w-full flex-col gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <InputText
                    label="Número de INSS"
                    labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                    disabled
                    editable={false}
                    className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 flex-1"
                    {...register("inssNumber")}
                  />
                </div>
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <InputText
                    label="Cuenta Bancaria (Nómina)"
                    labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                    disabled
                    editable={false}
                    className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 flex-1"
                    {...register("bankAccountNumber")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
