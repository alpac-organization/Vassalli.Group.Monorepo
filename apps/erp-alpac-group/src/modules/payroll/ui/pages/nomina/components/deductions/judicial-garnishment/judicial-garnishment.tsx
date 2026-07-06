import { Controller, useFormContext } from "react-hook-form";
import { Dropdown, InputText, Textarea } from "@alpac/design-system";
import { formatAmount, validateDecimalNumber, validatePositiveNumber } from "@app/shared/utils/number.utils";
import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const JudicialGarnishment = () => {

   const { register, control, formState: { errors } } = useFormContext<AddDeductionFormValues>();

   return (

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

         <Controller
            name="judicial_seizure_payload.currency"
            control={control}
            rules={{
               required: "Debe seleccionar una moneda",
               validate: (val) => val !== 0 || "Selección inválida",
            }}
            render={({ field }) => (
               <Dropdown
                  label="Moneda"
                  isRequired
                  options={CurrencyOptions ?? []}
                  placeholder="Seleccione..."
                  onChange={(value) => field.onChange(value)}
                  error={errors.loans_payload?.currency?.message as string}
                  value={field.value}
                  appearance="dark"
                  labelClassName={labelClassName}
                  valueClassName={labelClassName}
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
               />
            )}
         />

         <InputText
            label="Monto total a deducir"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className={inputClassName}
            labelClassName={labelClassName}
            isRequired
            {...register("judicial_seizure_payload.total_amount_to_pay", {
               required: "El monto total de la deuda es requerido",
               setValueAs: (value: unknown) => {
                  const stringValue =
                     typeof value === "string" ? value : String(value || "");
                  const trimmed = stringValue.trim();
                  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
               },
               validate: (value?: number) =>
                  (value !== undefined && value > 0) ||
                  "El monto total de la deuda debe ser mayor a 0",
               onChange: (evt) => {
                  evt.target.value = formatAmount(evt.target.value, 8, 2);
               },
            })}
            error={
               errors.purisima_information?.purisima_payload?.amount?.message
            }
         />

         <InputText
            label="Porcentaje de deducción"
            labelClassName={labelClassName}
            type="text"
            isRequired
            className={inputClassName}
            error={errors.judicial_seizure_payload?.deduction_percentage?.message}
            {...register("judicial_seizure_payload.deduction_percentage", {
               required: "Cantidad de días a solicitar son requeridos.",
               validate: {
                  validateDecimal: (value) => validateDecimalNumber(value),
                  validatePositive: (value) => validatePositiveNumber(value),
               },
               onChange: (evt) => {
                  evt.target.value = String(
                     formatNumberWithDecimals(evt.target.value, true),
                  );
               },
            })}
         />

         <div className="col-span-2">
            <Controller
               name="judicial_seizure_payload.description"
               control={control}               
               render={({ field }) => (
                  <Textarea
                     label="Descripción"
                     labelClassName={labelClassName}
                     rows={3}
                     placeholder=""
                     className={`${inputClassName} resize-none`}                     
                     value={field.value ?? ""}
                     onChange={field.onChange}                     
                  />
               )}
            />
         </div>

      </div>
   );
};
