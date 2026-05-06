import { useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import { VacationManagementModal } from "./vacation-management-modal";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { VacationManagementSectionProps } from "./types/vacation-managment.types";
import { useVacation } from "@app/modules/payroll/ui/hooks/vacation/useVacation";
import { useUserStore } from "@app/shared/stores/useUserStore";

/**
 * @description
 * Componente que muestra la gestión de vacaciones del colaborador
 * @param props - Props del componente
 * @param props.profile - Perfil del colaborador
 */
export const VacationManagementSection = ({ profile }: VacationManagementSectionProps) => {

   const { companyId, moduleCode } = useUserStore();

   const initialData = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: profile.personal_information.identification_number!
   }

   const [showModal, setShowModal] = useState(false);
   const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();

   const { GetVacationSaldoQuery } = useVacation(initialData);
   const { data: vacationData } = GetVacationSaldoQuery;

   return (
      <section className="flex flex-col gap-3 p-4 border dark:bg-[#272b34] bg-white border-slate-200 dark:border-neutral-700 shadow-sm">

         <div className="flex items-center justify-between">

            <Button
               type="button"
               label="Actualizar Vacaciones"
               size="giant"
               onClick={() => setShowModal(true)}
               icon={<PlusIcon size={20} />}
               className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
         </div>

         <div className="grid grid-cols-3 gap-3">
            {[
               { label: "Vacaciones generadas", value: vacationData?.genered_vacation, valueClass: "text-blue-500 dark:text-blue-400", borderClass: "border-t-blue-400" },
               { label: "Vacaciones disfrutadas", value: vacationData?.enjoyed_vacation, valueClass: "text-amber-500 dark:text-amber-400", borderClass: "border-t-amber-400" },
               { label: "Vacaciones disponibles", value: vacationData?.available_vacations, valueClass: "text-emerald-500 dark:text-emerald-400", borderClass: "border-t-emerald-400" },
            ].map(({ label, value, valueClass, borderClass }) => (
               <div key={label} className={`flex flex-col gap-1 rounded-md border border-slate-200 dark:border-neutral-600 ${borderClass} bg-slate-50 dark:bg-[#1e2229] px-4 py-3`}>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">{label}</span>
                  {GetVacationSaldoQuery.isPending ? (
                     <span className="inline-block h-6 w-12 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
                  ) : (
                     <span className={`text-2xl font-bold ${valueClass}`}>{value ?? "—"} <span className="text-sm font-medium">días</span></span>
                  )}
               </div>
            ))}
         </div>

         <AnimatedAlertWrapper open={alertState?.open ?? false}>
            <Alert
               type={alertState?.type!}
               title={alertState?.title}
               message={alertState?.message!}
               onClose={handleCloseAlert}
            />
         </AnimatedAlertWrapper>

         <VacationManagementModal
            profile={profile}
            vacationData={vacationData!}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onRequestError={handleRequestError}
            onRequestSuccess={handleRequestSuccess}
         />

      </section>
   );
};