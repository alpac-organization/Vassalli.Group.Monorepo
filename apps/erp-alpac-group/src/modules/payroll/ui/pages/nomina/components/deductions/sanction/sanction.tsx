import { InputText } from "@alpac/design-system";
import { useFormContext } from "react-hook-form";

import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { formatAmount, validateIntegerNumber, validatePositiveNumber } from "@app/shared/utils/number.utils";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const Sanctions = () => {

   const { register, formState: { errors } } = useFormContext<AddDeductionFormValues>();

   return (
      <div className="grid gap-4">
         <InputText
            label="Cantidad de días"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className={inputClassName}
            labelClassName={labelClassName}
            isRequired
            {...register("sansion_payload.amount_days", {
               required: "La cantidad de días es requerida",
               validate: {
                  validateInteger: (value) => validateIntegerNumber(value),
                  validatePositive: (value) => validatePositiveNumber(value),
               },
               setValueAs: (value) => {
                  const trimmed = String(value ?? "").trim();
                  return trimmed ? parseInt(trimmed) : undefined;
               },
               onChange: (evt) => {
                  evt.target.value = formatAmount(evt.target.value, 1, 0);
               },
            })}
            error={errors.sansion_payload?.amount_days?.message}
         />
      </div>
   );
};
