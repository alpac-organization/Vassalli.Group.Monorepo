import { useState } from "react";
import { Button } from "@alpac/design-system";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import { CheckIcon, XIcon } from "lucide-react";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";

import type { MedicalAppointmentFormProps } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/medical-appointment-form/medical-appointment-form.types";
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";

export const MedicalAppointmentForm = (props: MedicalAppointmentFormProps) => {

   const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: ConfirmActionType;
   }>({
      isOpen: false,
      type: null
   });

   const { ApproveApplication, RejectApplication } = useApplications();

   return (
      <div className="flex flex-col gap-6">

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-md border border-slate-600 bg-white dark:bg-[#272b34]">

            {/* Colaborador Donante */}
            <div className="flex flex-col gap-1">
               <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Colaborador
               </span>
               <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     Posible nombre del colaborador
                  </span>
                  <span className="text-[13px]! font-medium text-slate-500 dark:text-slate-400">
                     Código: Posible código del colaborador
                  </span>
               </div>
            </div>
         </div>

         <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

         {/* Acciones de la Solicitud */}
         <div className="flex justify-end gap-3">
            <Button
               type="button"
               label="Rechazar Solicitud"
               className="rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
               onClick={() => setConfirmModal({ isOpen: true, type: 'REJECT' })}
               icon={<XIcon size={20} />}
               isHiddenLabelOnMobile
            />
            <Button
               type="button"
               label="Aprobar Solicitud"
               className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200"
               onClick={() => setConfirmModal({ isOpen: true, type: 'APPROVE' })}
               icon={<CheckIcon size={20} />}
               isHiddenLabelOnMobile
            />
         </div>

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, type: null })}
            type={confirmModal.type}
            isLoading={ApproveApplication.isPending || RejectApplication.isPending}
            disabled={ApproveApplication.isPending || RejectApplication.isPending}
            handleFinalAction={(type) => {
               if (type === 'APPROVE') {

               } else {

               }
            }}
         />
      </div>
   );
};