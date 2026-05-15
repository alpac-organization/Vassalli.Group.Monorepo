import { Controller, useFormContext } from "react-hook-form";
import { InputText, Checkbox, Dropdown } from "@alpac/design-system";
import { formatAmount, validatePositiveNumber } from "@app/shared/utils/number.utils";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { CurrencyOptions } from "@app/core/enums/currency.enum";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const Commission = () => {
   const { control, register, watch, clearErrors, formState: { errors } } = useFormContext<CreateIncomeRequest>();

   const isPercentage = watch("commission_income_payload.is_percentage");

   return (
      <div className="flex flex-col gap-4">
         <div className="flex flex-row gap-4">
            <Controller
               name="commission_income_payload.is_percentage"
               control={control}
               render={({ field }) => (
                  <Checkbox
                     label="Aplicar como porcentaje"
                     checked={field.value}
                     onChange={(e) => {
                        field.onChange(e.target.checked)
                        clearErrors("commission_income_payload.amount");
                        clearErrors("commission_income_payload.percentage");
                     }}
                  />
               )}
            />
         </div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Controller
               name="commission_income_payload.currency"
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
                     onChange={(value) => {
                        field.onChange(value);
                     }}
                     error={
                        errors.commission_income_payload?.currency &&
                        errors.commission_income_payload?.currency?.message
                     }
                     value={field.value}
                     appearance="dark"
                     labelClassName="text-black! dark:text-white!"
                     valueClassName="text-black! dark:text-white!"
                     className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
               )}
            />

            {isPercentage ? (
               <>
                  <div className="flex flex-col gap-1.5">
                     <Controller
                        name="commission_income_payload.percentage"
                        control={control}
                        rules={{
                           required: "Este campo es requerido",
                           validate: (value) => validatePositiveNumber(value)
                        }}
                        render={({ field }) => (
                           <InputText
                              label="Porcentaje (%)"
                              isRequired
                              placeholder="0.00"
                              inputMode="decimal"
                              className={inputClassName}
                              labelClassName={labelClassName}
                              {...field}
                              onChange={(e) => {
                                 const value = e.target.value;
                                 const finalValue = formatNumberWithDecimals(value, true);
                                 field.onChange(finalValue);
                              }}
                              error={errors.commission_income_payload?.percentage?.message as string}
                           />
                        )}
                     />
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <InputText
                        label="Monto base"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                        labelClassName="text-black! dark:text-white!"
                        isRequired
                        {...register("commission_income_payload.amount", {
                           required: "El monto base para aplicar porcentaje es requerido",
                           setValueAs: (value: any) => {
                              const stringValue = typeof value === "string" ? value : String(value || "");
                              const trimmed = stringValue.trim();
                              return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
                           },
                           validate: (value?: number) =>
                              (value !== undefined && value > 0) ||
                              "El monto base debe ser mayor a 0",
                        })}
                        error={
                           errors.commission_income_payload?.amount?.message as string
                        }
                        onChange={(evt) => {
                           evt.target.value = formatAmount(evt.target.value, 18, 3);
                        }}
                     />
                  </div>
               </>
            ) : (
               <div className="flex flex-col gap-1.5">

                  <InputText
                     label="Monto a pagar"
                     type="text"
                     inputMode="decimal"
                     placeholder="0.00"
                     className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                     labelClassName="text-black! dark:text-white!"
                     isRequired
                     {...register("commission_income_payload.amount", {
                        required: "El monto a pagar es requerido",
                        setValueAs: (value: any) => {
                           const stringValue = typeof value === "string" ? value : String(value || "");
                           const trimmed = stringValue.trim();
                           return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
                        },
                        validate: (value?: number) =>
                           (value !== undefined && value > 0) ||
                           "El monto a pagar es requerido",
                     })}
                     error={errors.commission_income_payload?.amount?.message as string}
                     onChange={(evt) => {
                        evt.target.value = formatAmount(evt.target.value, 18, 3);
                     }}
                  />

               </div>
            )}
         </div>
      </div>
   );
};

