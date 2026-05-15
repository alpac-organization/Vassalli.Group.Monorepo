import { useFormContext } from "react-hook-form";
import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { InputText } from "@alpac/design-system";
import { validatePositiveNumber } from "@app/shared/utils/number.utils";

export const LateArrivals = () => {
   const { register, formState: { errors } } = useFormContext<CreateDeductionRequest>();

   return (
      <div className="grid gap-4">
         <InputText
            isRequired
            label="Total de minutos de tardanza"
            placeholder="Ej. 123"
            className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
            labelClassName="text-black! dark:text-white!"
            {...register("late_arrivals_payload.total_minutes", {
               required: "Total de minutos es requerido",
               valueAsNumber: true,
               validate: {
                  validatePositive: (value) => validatePositiveNumber(value, true),
               }
            })}
            error={errors.late_arrivals_payload?.total_minutes?.message}
         />
      </div>
   );
};