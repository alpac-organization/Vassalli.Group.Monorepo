import { useForm } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import type { WorkFormData } from "../types/profile-details.types";

const readOnlyInputClasses =
  "!h-[42px] disabled:dark:!bg-transparent disabled:dark:!text-slate-300 disabled:dark:!border-transparent disabled:!px-0 disabled:!opacity-100 disabled:!shadow-none";

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
    <div className="flex flex-col h-full w-full dark:bg-[#272b34] p-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full mb-8">
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Área de Trabajo
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("workArea")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Posición / Cargo
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("jobPosition")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
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
        </section>

        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Correo de Trabajo
              </label>
              <InputText
                type="email"
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("workEmail")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Número de INSS
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("inssNumber")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Cuenta Bancaria (Nómina)
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("bankAccountNumber")}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
