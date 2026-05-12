import { useCallback } from "react";
import type { AddDeductionFormProps } from "./add-deduction-form.types";
import { Button, Dropdown } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { DeductionOptions } from "@app/modules/payroll/domain/enums/deduction-enums/deduction.enum";
import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { AnnualBonusAdvance } from "../annual-bonus-advance/annual-bonus-advance";
import { ChildSupportGarnishment } from "../child-support-garnishment/child-support-garnishment";
import { DisciplinaryFine } from "../disciplinary-fine/disciplinary-fine";
import { JudicialGarnishment } from "../judicial-garnishment/judicial-garnishment";
import { LoanRepayment } from "../loan-repayment/loan-repayment";
import { PurisimaContribution } from "../purisima-contribution/purisima-contribution";
import { SalaryAdvance } from "../salary-advance/salary-advance";
import { LateArrivals } from "../late-arrivals/late-arrivals";

const inputClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const AddDeductionForm = ({ collaborator, onSubmit, onCancel, onRequestError, onRequestSuccess }: AddDeductionFormProps): React.ReactNode => {

   const { moduleCode, companyId } = useUserStore();

   const {
      register, handleSubmit, watch, control, formState: { errors, isDirty, isValid }
   } = useForm<CreateDeductionRequest>({
      mode: "onChange",
      defaultValues: {
         deduction_type: "",
         company_id: companyId,
         module_code: moduleCode,
         collaborator_id: collaborator.collaborator_id.toString(),
      }
   });

   const deductionType = watch("deduction_type");

   const handleSubmitDeduction = useCallback((data: CreateDeductionRequest) => {
      onSubmit?.(data);
   }, [onSubmit]);

   return (
      <div className="flex flex-col gap-4">

         {/* ── Sección: Tipo de Deducción ── */}
         <div>

            <Controller
               name="deduction_type"
               control={control}
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

         {deductionType === "ANNUAL_BONUS_ADVANCE" && <AnnualBonusAdvance />}
         {deductionType === "CHILD_SUPPORT_GARNISHMENT" && <ChildSupportGarnishment />}
         {deductionType === "DISCIPLINARY_FINE" && <DisciplinaryFine />}
         {deductionType === "JUDICIAL_GARNISHMENT" && <JudicialGarnishment />}
         {deductionType === "LOAN_REPAYMENT" && <LoanRepayment />}
         {deductionType === "PURISIMA_CONTRIBUTION" && <PurisimaContribution />}
         {deductionType === "SALARY_ADVANCE" && <SalaryAdvance />}
         {deductionType === "LATE_ARRIVALS" && <LateArrivals />}

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
               label="Agregar Deducción"
               disabled={!isDirty || !isValid}
               isLoading={false}
               onClick={handleSubmit(handleSubmitDeduction)}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </div>
   );
};