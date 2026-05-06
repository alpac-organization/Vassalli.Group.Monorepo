import { Button, InputText, Modal } from "@alpac/design-system";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { validatePositiveNumber } from "@app/shared/utils/number.utils";
import type { VacationManagementModalProps } from "./types/vacation-managment.types";
import type { AddVacationBalanceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-requests/add-vacation-balance.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useVacation } from "@app/modules/payroll/ui/hooks/vacation/useVacation";
import { useMappedError } from "@app/shared/hooks/useMappedError";

export const VacationManagementModal = ({ profile, vacationData, isOpen, onClose, onRequestError, onRequestSuccess }: VacationManagementModalProps) => {

   const { getMappedError } = useMappedError();
   const { companyId, moduleCode } = useUserStore();

   const initialData = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: profile.personal_information.identification_number!
   }

   const { UpdateVacationBalanceMutation } = useVacation(initialData);

   const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<AddVacationBalanceRequest>({
      defaultValues: { ...initialData },
      mode: "onChange",
   });

   // Cuando la query resuelva, sincroniza el vacation_id con el form
   useEffect(() => {
      if (vacationData?.vacation_id) {
         reset({
            ...initialData,
            vacation_id: vacationData.vacation_id,
         });
      }
   }, [vacationData?.vacation_id]);


   const onSubmit = (data: AddVacationBalanceRequest) => {
      UpdateVacationBalanceMutation.mutate(data, {
         onSuccess: () => {
            onRequestSuccess?.("Saldo de vacaciones actualizado exitosamente.");
            handleCloseModal();
         },
         onError: (error) => {
            const mappedError = getMappedError(error);
            onRequestError?.(mappedError.description);
         },
      });
   };

   const handleCloseModal = () => {
      reset();
      onClose();
   }

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleCloseModal}
         title="Administrar Saldo de Vacaciones"
         variant="form"
         size="md"
      >
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
               <InputText
                  label="Vacaciones disponibles"
                  className="h-10! w-full! font-semibold! rounded-md! text-[15px] dark:text-slate-100 text-white! dark:bg-[#272b34]! dark:border-slate-600!"
                  labelClassName="text-black! dark:text-white!"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  isRequired
                  error={errors.vacation_balance?.message}
                  {...register("vacation_balance", {
                     valueAsNumber: true,
                     required: "El saldo de vacaciones es requerido.",
                     validate: {
                        validatePositive: (value) => validatePositiveNumber(value),
                     },
                  })}
               />
            </div>

            <div className="flex flex-col gap-1.5">
               <InputText
                  label="Vacaciones disfrutadas"
                  className="h-10! w-full! font-semibold! rounded-md! text-[15px] dark:text-slate-100 text-white! dark:bg-[#272b34]! dark:border-slate-600!"
                  labelClassName="text-black! dark:text-white!"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  isRequired
                  error={errors.enjoyed_vacation?.message}
                  {...register("enjoyed_vacation", {
                     valueAsNumber: true,
                     required: "Las vacaciones disfrutadas son requeridas.",
                     validate: {
                        validatePositive: (value) => validatePositiveNumber(value),
                     },
                  })}
               />
            </div>

            <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  onClick={handleCloseModal}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
               />
               <Button
                  type="submit"
                  size="giant"
                  label="Guardar"
                  disabled={!isValid || UpdateVacationBalanceMutation.isPending}
                  isLoading={UpdateVacationBalanceMutation.isPending}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>

         </form>
      </Modal>
   );
};
