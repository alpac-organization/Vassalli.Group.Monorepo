import { InputText } from "@alpac/design-system";
import { useFormContext } from "react-hook-form";

import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";

export const LateArrival = () => {

   const { register, formState: { errors } } = useFormContext<AddDeductionFormValues>();

   return (
      <div className="grid gap-4">
         <InputText
            label="Cantidad de minutos"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
            labelClassName="text-black! dark:text-white!"
            isRequired
            {...register("late_arrivals_information.late_arrivals_payload.total_minutes", {
               required: "La cantidad de minutos son requeridas",
               validate: (value?: number) => (value !== undefined && value > 0) || "La cantidad de minutos deben ser mayor a 0",
               setValueAs: (value) => {
                  const trimmed = String(value ?? "").trim();
                  return trimmed ? parseFloat(trimmed) : undefined;
               },
               onChange: (evt) => { evt.target.value = String(formatNumberWithDecimals(evt.target.value)) },
            })}
            error={
               errors.late_arrivals_information?.late_arrivals_payload?.total_minutes &&
               errors.late_arrivals_information?.late_arrivals_payload?.total_minutes.message
            }
         />
      </div>
   );
} 