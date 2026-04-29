import { useCallback, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Alert, AnimatedAlertWrapper, Button, Dropdown, InputText, Textarea } from "@alpac/design-system"
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { AllowanceCodeEnum } from "@app/modules/payroll/domain/enums/allowance-enums/allowance.enum"
import { useMappedError } from "@app/shared/hooks/useMappedError"
import { formatAmount } from "@app/shared/utils/number.utils"

import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response"
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request"
import type { AddAllowanceFormProps } from "./add-allowance-form.types"

export const AddAllowanceForm = ({ identificationNumber, onSuccess }: AddAllowanceFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();

   const {
      control, register, handleSubmit,
      formState: { errors, isDirty, isValid }
   } = useForm<CreateIncomeRequest>({
      mode: "onChange",
      defaultValues: {
         company_id: companyId!,
         module_code: moduleCode!,
         identification_number: identificationNumber
      }
   });

   const [selectedIncomeType, setSelectedIncomeType] = useState<IncomesTypesResponse | undefined>(undefined);
   const [showAlert, setShowAlert] = useState<{
      show: boolean;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
   }>({
      show: false,
      type: "info",
      title: "",
      message: "",
   });

   const ALLOWANCE_CODES = [
      AllowanceCodeEnum.ALW_MEAL,
      AllowanceCodeEnum.ALW_HOUSING,
      AllowanceCodeEnum.ALW_TRANSPORT
   ] as AllowanceCodeEnum[];

   const { GetIncomeTypes, CreateIncomes } = useIncomes({ incomesTypesPayload: { company_id: companyId! } })

   const { data: incomeTypesData } = GetIncomeTypes;

   const incomeTypeOptions = useMemo(() => {
      if (!incomeTypesData || !Array.isArray(incomeTypesData)) {
         return [];
      }

      return incomeTypesData.map((incomeType: IncomesTypesResponse) => {

         if (ALLOWANCE_CODES.includes(incomeType.income_code as AllowanceCodeEnum)) {
            return {
               id: incomeType.type_income_id,
               value: incomeType.income_code,
               label: incomeType.income_title,
            }
         }

         return []

      }).filter(Boolean)

   }, [incomeTypesData]);


   const codeSelectedType = useMemo<AllowanceCodeEnum | undefined>(
      () => {
         if (!selectedIncomeType?.income_code) return undefined;
         return selectedIncomeType?.income_code as AllowanceCodeEnum;
      },
      [selectedIncomeType]
   );

   const isTypeAllowance = useMemo(() => {
      if (!codeSelectedType) return false;

      return ALLOWANCE_CODES.includes(codeSelectedType);

   }, [codeSelectedType]);

   const createIncome = (data: CreateIncomeRequest) => {

      const payload = {
         ...data,
         type_income_id: selectedIncomeType?.type_income_id ?? "",
         income_amount: data.income_amount
      }

      CreateIncomes.mutate(payload, {
         onSuccess: () => {
            onSuccess?.();
            setFormDataToSubmit(null);

            setShowAlert({
               show: true,
               type: "success",
               title: "Ingreso agregado",
               message: `El ingreso ha sido agregado exitosamente.`
            });

            handleCloseAlert();
         },
         onError: (error) => {
            const mappedError = getMappedError(error)

            setShowAlert({
               show: true,
               type: "error",
               title: "Error",
               message: mappedError.description
            });

            handleCloseAlert();
         }
      })
   }

   const handleCloseAlert = useCallback(() => {
      setTimeout(() => {
         setShowAlert({ show: false, type: "info", title: "", message: "" });
      }, 3000);
   }, []);

   const [formDataToSubmit, setFormDataToSubmit] = useState<CreateIncomeRequest | null>(null);

   const handleValidForm = (data: CreateIncomeRequest) => {
      setFormDataToSubmit(data);
   };

   const executeCreateIncome = () => {
      if (formDataToSubmit) {
         createIncome(formDataToSubmit);
      }
   };

   return (
      <form onSubmit={handleSubmit(handleValidForm)} className="flex flex-col gap-4">

         <Controller
            name="type_income_id"
            control={control}
            rules={{
               required: "El tipo de ingreso es requerido",
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
                  labelClassName="text-black! dark:text-white!"
                  valueClassName="text-black! dark:text-white!"
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
               />
            )}
         />

         {/* meal, housing and transportation inputs */}
         {isTypeAllowance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

               <InputText
                  label="Monto del viático"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  isRequired
                  {...register("income_amount", {
                     required: "El monto del viático es requerido",
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
                     errors.income_amount &&
                     errors.income_amount?.message
                  }
               />

            </div>
         )}

         {selectedIncomeType && isTypeAllowance && (
            <Textarea
               label="Motivo u observación"
               className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
               labelClassName="text-black! dark:text-white!"
               isRequired
               placeholder="Motivo u observación"
               maxLength={500}
               {...register("description", {
                  required: "El motivo del ingreso es requerido",
                  maxLength: {
                     value: 500,
                     message: "El motivo del ingreso debe tener menos de 500 caracteres",
                  },
               })}
               error={errors.description && errors.description.message}
            />
         )}

         <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

         <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
               type="button"
               size="giant"
               label="Cancelar"
               onClick={() => { }}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
            <Button
               type="submit"
               size="giant"
               label="Agregar Viáticos"
               disabled={!isDirty || !isValid || !isTypeAllowance}
               isLoading={CreateIncomes.isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>

         <AnimatedAlertWrapper open={showAlert.show}>
            <Alert
               type={showAlert.type}
               title={showAlert.title}
               message={showAlert.message}
               onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
            />
         </AnimatedAlertWrapper>

      </form>
   )
}