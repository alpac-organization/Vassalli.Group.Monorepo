import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import { validatePositiveNumber } from "@app/shared/utils/number.utils";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const Overtime = () => {
   const { control, formState: { errors } } = useFormContext();

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
         <div className="flex flex-col gap-1.5">
            <Controller
               name="overtime_income_payload.amount_hours"
               control={control}
               rules={{
                  required: "Las horas son requeridas",
                  validate: (value) => validatePositiveNumber(value)
               }}
               render={({ field }) => (
                  <InputText
                     label="Horas Extras"
                     isRequired
                     placeholder="0.00"
                     inputMode="decimal"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     {...field}
                     onChange={(e) => {
                        const value = e.target.value;
                        const finalValue = formatNumberWithDecimals(value);
                        field.onChange(finalValue);
                     }}
                     error={errors.amount_hours?.message as string}
                  />
               )}
            />
         </div>
      </div>
   );
};
