import { Controller, useForm } from "react-hook-form"
import { Dropdown, InputText, RadioButton, Textarea } from "@alpac/design-system"
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { useMemo, useState } from "react"
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response"

export const AddIncomeForm = () => {

   const { companyId } = useUserStore()

   const { control, register } = useForm({
      defaultValues: {
         type: "",
         amount: "",
         description: "",
      }
   });

   const incomesTypeCodes = {
      BONUS: "BONUS",
      OVERTIME: "OVERTIME",
      ALW_MEAL: "ALW_MEAL",
      ALW_HOUSING: "ALW_HOUSING",
      ALW_TRANSPORT: "ALW_TRANSPORT",
      // HOLIDAY: "HOLIDAY",
      // COMMISSION: "COMMISSION"
   };

   // Endpoint para registrar ingresos
   // POST
   // companies/{companie_id}/modules/{module_code}/incomes

   const mealAllowanceType = [
      { value: "fixed", label: "Fijo" },
      { value: "travel", label: "Viático" }
   ];

   const { GetIncomeTypes } = useIncomes({ incomesTypesPayload: { company_id: companyId! } })

   const { data: incomeTypesData } = GetIncomeTypes;

   const incomeTypeOptions = useMemo(() => {
      if (!incomeTypesData || !Array.isArray(incomeTypesData)) {
         return [];
      }

      return incomeTypesData.map((incomeType: IncomesTypesResponse) => {
         return {
            value: incomeType.income_code,
            label: incomeType.income_title,
         }
      })
   }, [incomeTypesData]);

   const [selectedIncomeType, setSelectedIncomeType] = useState<IncomesTypesResponse | undefined>(undefined);

   return (
      <form className="flex flex-col gap-4">

         <Controller
            name="type"
            control={control}
            rules={{
               required: false,
            }}
            render={({ field }) => (
               <Dropdown
                  placeholder="Tipo de ingreso"
                  appearance="dark"
                  value={field.value}
                  onChange={(value) => {
                     field.onChange(value)
                     const selectedIncomeType = incomeTypesData
                        ?.find((incomeType: IncomesTypesResponse) => incomeType.income_code === value)
                     setSelectedIncomeType(selectedIncomeType)
                  }}
                  options={incomeTypeOptions ?? []}
               />
            )}
         />

         {/* Bonus inputs  */}
         {selectedIncomeType?.income_code === incomesTypeCodes.BONUS && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-1 md:col-span-2">
                  <InputText
                     label="Monto"
                     className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                     labelClassName="text-black! dark:text-white!"
                     type="texto"
                     placeholder="Monto"
                     {...register("amount", {
                        required: false,
                     })}
                  />
               </div>
            </div>
         )}

         {/* Overtime inputs  */}

         {
            selectedIncomeType?.income_code === incomesTypeCodes.OVERTIME && (
               <div className="flex flex-row items-center gap-4">
                  <RadioButton
                     id="extra-ordinary"
                     value="extraOrdinary"
                     label="Extra Ordinaria"
                     labelPosition="right"
                     labelClassName="text-black! dark:text-white!"
                     className="whitespace-nowrap!"
                     onChange={() => { }}
                  />

                  <RadioButton
                     id="extra-nighttime"
                     value="extraNighttime"
                     label="Extra Nocturna"
                     labelPosition="right"
                     labelClassName="text-black! dark:text-white!"
                     className="whitespace-nowrap!"
                     onChange={() => { }}
                  />

                  <InputText
                     label="Cantidad de horas extras"
                     className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                     labelClassName="text-black! dark:text-white!"
                     type="number"
                     placeholder="Cantidad de horas extras"
                     {...register("amount", {
                        required: false,
                     })}
                  />
               </div>
            )
         }

         {/* meal, housing and transportation inputs */}
         {[incomesTypeCodes.ALW_MEAL, incomesTypeCodes.ALW_HOUSING, incomesTypeCodes.ALW_TRANSPORT].includes(selectedIncomeType?.income_code as string) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-1 md:col-span-2">
                  <Controller
                     name="type"
                     control={control}
                     rules={{
                        required: false,
                     }}
                     render={({ field }) => (
                        <Dropdown
                           label="Tipo de Viático alimenticio"
                           placeholder="Tipo de viático alimenticio"
                           appearance="dark"
                           value={field.value}
                           onChange={(value) => field.onChange(value)}
                           options={[]}
                        />
                     )}
                  />
               </div>

               <InputText
                  label="Monto del viático"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  type="number"
                  placeholder="Monto del viático"
                  {...register("amount", {
                     required: false,
                  })}
               />

               <InputText
                  label="Referencia o N° Factura"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  type="number"
                  placeholder="Referencia o N° Factura"
                  {...register("amount", {
                     required: false,
                  })}
               />
            </div>
         )}

         {selectedIncomeType && (
            <Textarea
               label="Motivo u observación"
               className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
               labelClassName="text-black! dark:text-white!"
               placeholder="Motivo u observación"
               {...register("description", {
                  required: false,
               })}
            />
         )}

      </form>
   )
}