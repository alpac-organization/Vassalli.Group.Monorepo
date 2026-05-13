import type { CreateIncomeFormProps, IncomeTypeOption } from "./create-income-form.types";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { Button, Dropdown, Textarea } from "@alpac/design-system";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes";
import { IncomeTypeEnum } from "@app/modules/payroll/domain/enums/income-enums/income.enum";
import { useMemo } from "react";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Overtime } from "../overtime/overtime";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const CreateIncomeForm = ({ collaborator, payrollId, onCancel, onRequestSuccess, onRequestError }: CreateIncomeFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();

   const methods = useForm<CreateIncomeRequest>({
      mode: "onChange",
      defaultValues: {
         company_id: companyId,
         module_code: moduleCode,
         payroll_id: payrollId,
         identification_number: collaborator.personal_information.identification_number,
      }
   });

   const INCOMES_TYPES = [
      IncomeTypeEnum.INCOME_OVERTIME,
   ] as IncomeTypeEnum[];

   const { GetIncomeTypes, CreateIncome } = useIncomes({ incomesTypesPayload: { company_id: companyId! } })

   const { data: incomeTypesData, isLoading: isLoadingIncomeTypes } = GetIncomeTypes;

   const incomeTypeOptions = useMemo(() => {

      if (!incomeTypesData || !Array.isArray(incomeTypesData)) {
         return [];
      }

      return incomeTypesData.reduce((accumulate: IncomeTypeOption[], item: IncomesTypesResponse) => {
         if (INCOMES_TYPES.includes(item.income_code as IncomeTypeEnum)) {
            accumulate.push({
               id: item.type_income_id,
               code: item.income_code,
               label: item.income_title,
            })
         }
         return accumulate;
      }, [] as IncomeTypeOption[]);
   }, [incomeTypesData]);

   const incomeTypeId = methods.watch("type_income_id");

   const selectedIncomeTypeCode = useMemo(() => {
      return incomeTypeOptions.find(opt => opt.id === incomeTypeId)?.code;
   }, [incomeTypeId, incomeTypeOptions]);

   const onSubmit = async (data: CreateIncomeRequest) => {

      const payload = {
         ...data,
         ...(selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME && {
            overtime_income_payload: {
               amount_hours: Number(data.overtime_income_payload?.amount_hours) || 0,
            }
         })
      };

      await CreateIncome.mutateAsync(payload, {
         onSuccess: () => {
            onRequestSuccess?.("Ingreso registrado correctamente");
         },
         onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(mappedError.description || "Error al registrar el ingreso");
         },
      });
   };

   return (
      <FormProvider {...methods}>
         <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex min-w-0 flex-col gap-4 sm:gap-5" noValidate>

            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1.5">
                  <Controller
                     name="type_income_id"
                     control={methods.control}

                     rules={{ required: "El tipo de ingreso es requerido" }}
                     render={({ field }) => (
                        <Dropdown
                           label="Tipo de ingreso"
                           isRequired
                           placeholder={isLoadingIncomeTypes ? "Cargando..." : "Seleccione un tipo de ingreso"}
                           appearance="dark"
                           value={field.value}
                           onChange={field.onChange}
                           options={incomeTypeOptions.map(opt => ({
                              value: opt.id,
                              label: opt.label
                           }))}
                           error={methods.formState.errors.type_income_id?.message}
                           labelClassName={labelClassName}
                           valueClassName={labelClassName}
                           className={inputClassName}
                        />
                     )}
                  />
               </div>

               {selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME && (
                  <Overtime />
               )}

               {
                  selectedIncomeTypeCode && (
                     <Textarea
                        label="Descripción"
                        labelClassName={labelClassName}
                        rows={3}
                        maxLength={500}
                        placeholder="Motivo del ingreso..."
                        className={`${inputClassName} resize-none`}
                        error={methods.formState.errors.description?.message}
                        {...methods.register("description",
                           {
                              maxLength: {
                                 value: 500,
                                 message: "La descripción debe tener como máximo 500 caracteres"
                              }
                           })
                        }
                     />
                  )
               }

            </div>

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
                  type="submit"
                  size="giant"
                  label="Registrar Ingreso"
                  disabled={CreateIncome.isPending}
                  isLoading={CreateIncome.isPending}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>
         </form>
      </FormProvider>
   );
}
