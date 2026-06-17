import { Controller, useFormContext } from "react-hook-form";
import { Dropdown, InputText, Textarea } from "@alpac/design-system";
import { formatAmount } from "@app/shared/utils/number.utils";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const parsePositiveInteger = (value: unknown): number | undefined => {
   const trimmed = String(value ?? "").trim();
   if (!trimmed) return undefined;
   const parsed = parseInt(trimmed.replace(/\D/g, ""), 10);
   return Number.isFinite(parsed) ? parsed : undefined;
};

export const LoanRepayment = () => {
   const {
      register,
      control,
      formState: { errors },
   } = useFormContext<AddDeductionFormValues>();

   return (
      <div className="flex flex-col gap-4">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
               label="Monto del préstamo"
               type="text"
               inputMode="decimal"
               placeholder="0.00"
               className={inputClassName}
               labelClassName={labelClassName}
               isRequired
               {...register("loans_payload.amount", {
                  required: "El monto del préstamo es requerido",
                  setValueAs: (value: unknown) => {
                     const stringValue =
                        typeof value === "string" ? value : String(value || "");
                     const trimmed = stringValue.trim();
                     return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
                  },
                  validate: (value?: number) =>
                     (value !== undefined && value > 0) ||
                     "El monto del préstamo debe ser mayor a 0",
                  onChange: (evt) => {
                     evt.target.value = formatAmount(evt.target.value, 6, 2);
                  },
               })}
               error={errors.loans_payload?.amount?.message}
            />

            <InputText
               label="Plazo (quincenas)"
               type="text"
               inputMode="numeric"
               placeholder="0"
               className={inputClassName}
               labelClassName={labelClassName}
               isRequired
               {...register("loans_payload.number_fortnights", {
                  required: "El plazo en quincenas es requerido",
                  setValueAs: parsePositiveInteger,
                  validate: (value?: number) =>
                     (value !== undefined && Number.isInteger(value) && value > 0) ||
                     "El plazo debe ser un número entero mayor a 0",
                  onChange: (evt) => {
                     evt.target.value = evt.target.value.replace(/\D/g, "");
                  },
               })}
               error={errors.loans_payload?.number_fortnights?.message}
            />

            <Controller
               name="loans_payload.currency"
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
         </div>

         <Controller
            name="loans_payload.description"
            control={control}
            rules={{
               required: "La descripción es requerida",
               validate: (value?: string) =>
                  !!value?.trim() || "La descripción es requerida",
            }}
            render={({ field }) => (
               <Textarea
                  label="Descripción"
                  labelClassName={labelClassName}
                  rows={3}
                  placeholder="Ej. Préstamo personal"
                  className={`${inputClassName} resize-none`}
                  isRequired
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.loans_payload?.description?.message}
               />
            )}
         />
      </div>
   );
};
