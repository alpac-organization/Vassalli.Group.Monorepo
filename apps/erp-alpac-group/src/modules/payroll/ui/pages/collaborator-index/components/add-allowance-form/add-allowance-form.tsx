import { useCallback, useMemo } from "react"
import { Button, Checkbox, InputText } from "@alpac/design-system"
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { AllowanceCodeEnum } from "@app/modules/payroll/domain/enums/allowance-enums/allowance.enum"
import { formatAmount } from "@app/shared/utils/number.utils"
import { useForm, useFieldArray } from "react-hook-form"

import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response"
import type { AddAllowanceFormProps, Allowances, AllowanceTypeOption } from "./add-allowance-form.types";

export const AddAllowanceForm = ({ onSubmit, onCancel }: AddAllowanceFormProps) => {

   const { companyId } = useUserStore();

   const {
      control, register, handleSubmit,
      formState: { errors, isDirty, isValid }
   } = useForm<Allowances>({
      defaultValues: {
         allowances: []
      }
   });

   const { fields, append, remove } = useFieldArray({
      control,
      name: "allowances"
   });

   const ALLOWANCE_CODES = [
      AllowanceCodeEnum.ALW_MEAL,
      AllowanceCodeEnum.ALW_HOUSING,
      AllowanceCodeEnum.ALW_TRANSPORT
   ] as AllowanceCodeEnum[];

   const { GetIncomeTypes } = useIncomes({ incomesTypesPayload: { company_id: companyId! } })

   const { data: incomeTypesData, isLoading: isLoadingIncomeTypes } = GetIncomeTypes;

   const incomeTypeOptions = useMemo(() => {
      if (!incomeTypesData || !Array.isArray(incomeTypesData)) {
         return [];
      }

      return incomeTypesData.reduce((accumulate: AllowanceTypeOption[], item: IncomesTypesResponse) => {
         if (ALLOWANCE_CODES.includes(item.income_code as AllowanceCodeEnum)) {
            accumulate.push({
               id: item.type_income_id,
               code: item.income_code,
               label: item.income_title,
            })
         }
         return accumulate;
      }, [] as AllowanceTypeOption[]);
   }, [incomeTypesData]);

   const handleSubmitAllowance = useCallback((data: Allowances) => {
      onSubmit(data);
   }, [onSubmit]);

   return (
      <div className="flex flex-col gap-4">

         <div className="flex flex-row gap-4">
            {isLoadingIncomeTypes ? (
               Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className="w-[18px] h-[18px] rounded-[4px] bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                     <div className="w-20 h-3.5 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                  </div>
               ))
            ) : (
               incomeTypeOptions?.map((incomeType) => {

                  const fieldIndex = fields.findIndex((field) => field.type_income_id === incomeType.id);

                  const isChecked = fieldIndex !== -1;

                  return (
                     <Checkbox
                        key={incomeType.code}
                        label={incomeType.label}
                        value={incomeType.id}
                        checked={isChecked}
                        onChange={(e) => {
                           if (e.target.checked) {
                              append({
                                 type_income_id: incomeType.id,
                                 income_amount: 0,
                              })
                           } else {
                              remove(fieldIndex);
                           }
                        }}
                     />
                  )
               })
            )}
         </div>

         {/* meal, housing and transportation allowance inputs */}
         {
            fields.map((field, index) => {

               const label = incomeTypeOptions.find(opt => opt.id === field.type_income_id)?.label;

               return (
                  <div key={field.id} className="grid grid-cols-1 gap-6">

                     <InputText
                        label={`Monto C$: ${label}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                        labelClassName="text-black! dark:text-white!"
                        {...register(`allowances.${index}.income_amount`, {
                           required: false,
                           onChange: (evt) => {
                              evt.target.value = formatAmount(evt.target.value, 5, 2);
                           },
                           setValueAs: (value: any) => {
                              const stringValue = typeof value === "string" ? value : String(value || "");
                              const trimmed = stringValue.trim();
                              return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
                           },
                           validate: (value?: number) =>
                              (value !== undefined && value > 0) ||
                              "El salario debe ser mayor a 0",
                        })}
                        error={
                           errors.allowances?.[index]?.income_amount &&
                           errors.allowances?.[index]?.income_amount?.message
                        }
                     />
                  </div>
               );
            })
         }

         <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

         <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
               type="button"
               size="giant"
               label="Cancelar"
               onClick={onCancel}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
            <Button
               type="button"
               size="giant"
               label="Agregar Viáticos"
               disabled={!isDirty || !isValid}
               isLoading={false}
               onClick={handleSubmit(handleSubmitAllowance)}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>

      </div>
   )
}