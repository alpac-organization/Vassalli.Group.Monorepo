import type { CreateIncomeFormProps, IncomeTypeOption } from "./create-income-form.types";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { Button, Dropdown, Textarea } from "@alpac/design-system";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes";
import { IncomeTypeEnum } from "@app/modules/payroll/domain/enums/income-enums/income.enum";
import { useMemo, useState } from "react";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Overtime } from "../overtime/overtime";
import { Commission } from "../commission/commission";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";

import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { X } from "lucide-react";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const CreateIncomeForm = ({ payrollId, onCancel, onRequestSuccess, onRequestError }: CreateIncomeFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();

   const { identificationNumber } = useUserStore();
   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const methods = useForm<CreateIncomeRequest>({
      mode: "onChange",
      defaultValues: {
         company_id: companyId,
         module_code: moduleCode,
         payroll_id: payrollId,
      }
   });

   const INCOMES_TYPES = [
      IncomeTypeEnum.INCOME_OVERTIME,
      IncomeTypeEnum.INCOME_COMMISSION,
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

      if (!foundCollaborator) return;

      const payload = {
         ...data,
         identification_number: foundCollaborator?.personal_information?.identification_number!,
         ...(selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME && {
            overtime_income_payload: {
               amount_hours: Number(data.overtime_income_payload?.amount_hours) || 0,
            }
         }),
         ...(selectedIncomeTypeCode === IncomeTypeEnum.INCOME_COMMISSION && {
            commission_income_payload: {
               percentage: Number(data.commission_income_payload?.percentage) || 0,
               amount: Number(data.commission_income_payload?.amount) || 0,
               currency: Number(data.commission_income_payload?.currency) || 0,
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

               {
                  !foundCollaborator && (
                     selectedIncomeTypeCode === IncomeTypeEnum.INCOME_COMMISSION
                  ) &&
                  <CollaboratorSearchForm
                     onSuccess={(collaborator) => {
                        setFoundCollaborator(collaborator);
                        setIsSearching(false);
                     }}
                     onError={() => {
                        setFoundCollaborator(null);
                        setIsSearching(false);
                     }}
                     onSearchStart={() => {
                        setFoundCollaborator(null);
                        setIsSearching(true);
                     }}
                     excludeIdentifications={[identificationNumber]}
                  />
               }

               {
                  foundCollaborator && (
                     <div className="relative flex flex-row items-center gap-4 w-full">
                        <div className="min-w-0 flex-1">
                           <CollaboratorSummary
                              fullName={foundCollaborator?.full_name!}
                              workPosition={foundCollaborator?.work_position!}
                              isFullNameLoading={isSearching}
                              isWorkPositionLoading={isSearching}
                           />
                        </div>

                        {foundCollaborator && (
                           <div className="group flex items-center">
                              <button
                                 type="button"
                                 className={`rounded-full p-1.5 transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-white dark:hover:text-white dark:hover:bg-white/15`}
                                 onClick={() => {
                                    setFoundCollaborator(null)
                                 }}
                                 aria-label="Quitar Colaborador"
                              >
                                 <X size={20} />
                              </button>

                              <div className="absolute -top-10 right-0 mt-2 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                 Quitar Colaborador
                              </div>
                           </div>
                        )}
                     </div>
                  )
               }

               {selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME && (
                  <Overtime />
               )}

               {!!foundCollaborator && selectedIncomeTypeCode === IncomeTypeEnum.INCOME_COMMISSION && (
                  <Commission />
               )}

               {
                  !!foundCollaborator && selectedIncomeTypeCode !== IncomeTypeEnum.INCOME_OVERTIME && (
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
                  disabled={CreateIncome.isPending || !selectedIncomeTypeCode}
                  isLoading={CreateIncome.isPending}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>
         </form>
      </FormProvider>
   );
}
