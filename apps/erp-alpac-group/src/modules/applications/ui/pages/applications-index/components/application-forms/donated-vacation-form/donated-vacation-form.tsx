import { Button, InputText } from "@alpac/design-system";
import { formatDate } from "@app/shared/utils/string.utils";
import { useState } from "react";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import { CheckIcon, XIcon } from "lucide-react";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";

import type { DonatedVacationFormProps } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/donated-vacation-form/donated-vacation-form.types";
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";

export const DonatedVacationForm = (props: DonatedVacationFormProps) => {

   const { application } = props;

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
                  Colaborador Donante
               </span>
               <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     {application.requested_by || '—'}
                  </span>
                  <span className="text-[13px]! font-medium text-slate-500 dark:text-slate-400">
                     Código: {application.collaborator_code || 'Pendiente'}
                  </span>
               </div>
            </div>

            {/* Colaborador Beneficiario */}
            <div className="flex flex-col gap-1">
               <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Colaborador Beneficiario
               </span>
               <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     Noraida Maria Espinoza Jaen
                  </span>
                  <span className="text-[13px]! font-medium text-slate-500 dark:text-slate-400">
                     Código: Pendiente
                  </span>
               </div>
            </div>

            {/* Fecha de Creacion  */}
            <div className="flex flex-col gap-1">
               <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Fecha de Creación
               </span>
               <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     {formatDate(application.created_at)}
                  </span>
               </div>
            </div>

         </div>


         {/* Resumen de Días Totales */}
         <div className="bg-blue-50 dark:bg-blue-900/20 p-4 md:p-6 rounded-md flex flex-col md:flex-row justify-between items-center gap-4 border border-blue-100 dark:border-blue-800">
            <div className="flex flex-col text-center md:text-left">
               <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Total de días a recibir
               </span>
            </div>

            <span className="flex items-center gap-2 text-2xl font-bold text-blue-800 dark:text-white">
               <InputText
                  value={300}
                  readOnly
                  className="w-[100px]! text-2xl! text-center! rounded-md! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
               />
               Días
            </span>
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
                  ApproveApplication.mutate(application, {
                     onSuccess: () => setConfirmModal({ isOpen: false, type: null })
                  });
               } else {
                  RejectApplication.mutate(application, {
                     onSuccess: () => setConfirmModal({ isOpen: false, type: null })
                  });
               }
            }}
         />
      </div>
   );
};