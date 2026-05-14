import { useCallback } from "react";
import { Button, Dropdown, Textarea } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DeductionCodeEnum, DeductionOptions } from "@app/modules/payroll/domain/enums/deduction-enums/deduction.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { AnnualBonusAdvance } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/annual-bonus-advance/annual-bonus-advance";
import { ChildSupportGarnishment } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/child-support-garnishment/child-support-garnishment";
import { Sanctions } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/sanction/sanction";
import { JudicialGarnishment } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/judicial-garnishment/judicial-garnishment";
import { LoanRepayment } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/loan-repayment/loan-repayment";
import { PurisimaContribution } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/purisima-contribution/purisima-contribution";
import { SalaryAdvance } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/salary-advance/salary-advance";
import { LateArrivals } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/late-arrivals/late-arrivals";

import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { AddDeductionFormProps } from "./add-deduction-form.types";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { OtherDeduction } from "../other-deduction/other-deduction";

const inputClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const AddDeductionForm = ({ collaborator, onSubmit, onCancel, onRequestError, onRequestSuccess }: AddDeductionFormProps): React.ReactNode => {

   const { moduleCode, companyId } = useUserStore();
   const { CreateDeduction } = useDeduction();
   const { getMappedError } = useMappedError();

   const methods = useForm<CreateDeductionRequest>({
      mode: "onChange",
      defaultValues: {
         deduction_type: "",
         company_id: companyId,
         module_code: moduleCode,
         collaborator_id: collaborator.collaborator_id.toString(),
      }
   });

   const deductionType = methods.watch("deduction_type");

   const handleSubmitDeduction = useCallback((data: CreateDeductionRequest) => {
      const {
         late_arrivals_payload,
         purisima_payload,
         salary_advance_payload,
         ...baseData
      } = data;

      const finalPayload: CreateDeductionRequest = { ...baseData };

      if (data.deduction_type === DeductionCodeEnum.LATE_ARRIVAL.value) {
         finalPayload.late_arrivals_payload = late_arrivals_payload;
      }
      if (data.deduction_type === DeductionCodeEnum.PURISIMA.value) {
         finalPayload.purisima_payload = purisima_payload;
      }
      if (data.deduction_type === DeductionCodeEnum.SALARY_ADVANCE.value) {
         finalPayload.salary_advance_payload = salary_advance_payload;
      }

      console.log(finalPayload);

      CreateDeduction.mutate(finalPayload, {
         onSuccess: () => {
            methods.reset();
            onSubmit?.(finalPayload);
            onRequestSuccess?.("Deducción agregada correctamente");
            onCancel?.();
         },
         onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(mappedError?.description || "Error al agregar deducción");
         }
      });

   }, [CreateDeduction, getMappedError, onSubmit, onRequestError, onRequestSuccess]);

   return (
      <FormProvider {...methods}>
         <form className="flex flex-col gap-4" onSubmit={methods.handleSubmit(handleSubmitDeduction)}>

            {/* ── Sección: Tipo de Deducción ── */}
            <div>

               <Controller
                  name="deduction_type"
                  control={methods.control}
                  rules={{
                     required: false,
                  }}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de deducción"
                        placeholder="Seleccione el tipo de deducción"
                        appearance="dark"
                        isRequired
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        labelClassName={labelClassName}
                        valueClassName={labelClassName}
                        className={inputClassName}
                        options={DeductionOptions}
                     />
                  )}
               />

            </div>

            {deductionType === DeductionCodeEnum.LOAN.value && <LoanRepayment />}
            {deductionType === DeductionCodeEnum.CHRISTMAS_BONUS_ADVANCE.value && <AnnualBonusAdvance />}
            {deductionType === DeductionCodeEnum.LATE_ARRIVAL.value && <LateArrivals />}
            {deductionType === DeductionCodeEnum.SALARY_ADVANCE.value && <SalaryAdvance />}
            {deductionType === DeductionCodeEnum.SANCTION.value && <Sanctions />}
            {deductionType === DeductionCodeEnum.PURISIMA.value && <PurisimaContribution />}
            {deductionType === DeductionCodeEnum.CHILD_SUPPORT_GARNISHMENT.value && <ChildSupportGarnishment />}
            {deductionType === DeductionCodeEnum.JUDICIAL_GARNISHMENT.value && <JudicialGarnishment />}
            {deductionType === DeductionCodeEnum.OTHER_DEDUCTION.value && <OtherDeduction />}

            {
               !!deductionType && (
                  deductionType === DeductionCodeEnum.LATE_ARRIVAL.value ||
                  deductionType === DeductionCodeEnum.SALARY_ADVANCE.value ||
                  deductionType === DeductionCodeEnum.PURISIMA.value
               ) && (
                  <Controller
                     name="description"
                     control={methods.control}
                     rules={{
                        maxLength: {
                           value: 500,
                           message: "La descripción debe tener como máximo 500 caracteres"
                        }
                     }}
                     render={({ field }) => (
                        <Textarea
                           label="Descripción"
                           labelClassName={labelClassName}
                           rows={3}
                           maxLength={500}
                           placeholder="Detalles adicionales de la deducción..."
                           className={`${inputClassName} resize-none`}
                           value={field.value ?? ""}
                           onChange={field.onChange}
                           error={methods.formState.errors.description?.message as string}
                        />
                     )}
                  />
               )
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
                  type="submit"
                  size="giant"
                  label="Agregar Deducción"
                  disabled={
                     !methods.formState.isDirty ||
                     !methods.formState.isValid ||
                     (
                        deductionType !== DeductionCodeEnum.LATE_ARRIVAL.value &&
                        deductionType !== DeductionCodeEnum.SALARY_ADVANCE.value &&
                        deductionType !== DeductionCodeEnum.PURISIMA.value
                     )
                  }
                  isLoading={CreateDeduction.isPending}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>
         </form>
      </FormProvider>
   );
};