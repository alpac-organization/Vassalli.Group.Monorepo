import { Button, InputText, Textarea } from "@alpac/design-system";
import { useState } from "react";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import { CheckIcon, XIcon } from "lucide-react";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";
import type { DonatedVacationFormProps } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/donated-vacation-form/donated-vacation-form.types";
import { MainPanel } from "../../application-panels/main-panel/main-panel";
import { DonatedVacationPanel } from "../../application-panels/donated-vacation-panel/donated-vacation-panel";
import { useForm } from "react-hook-form";
import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";

export const DonatedVacationForm = (props: DonatedVacationFormProps) => {

   const { application } = props;
   const { ApproveApplication, RejectApplication } = useApplications();

   const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: ConfirmActionType;
   }>({
      isOpen: false,
      type: null
   });

   const { handleSubmit } = useForm<ApplicationProcessRequest>();

   const onSubmit = (data: ApplicationProcessRequest) => {
      console.log(data);
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}
         className="flex flex-col gap-6">

         <MainPanel application={application} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <DonatedVacationPanel application={application} />

            <MainPanel.Field label="Total de días a recibir" className="col-span-1">
               <InputText
                  className="h-10! w-full! font-semibold! rounded-md! text-[15px] dark:text-slate-100 text-white! dark:bg-[#272b34]! dark:border-slate-600!"
                  labelClassName="text-black! dark:text-white!"
                  type="text"
                  value={application?.amount_days || '—'}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  isRequired
                  readOnly
               />
            </MainPanel.Field>

            <MainPanel.Field label="Motivo o Descripción" className="col-span-full">
               <Textarea
                  className="rounded-md"
                  value={application.description || 'Sin descripción'}
                  readOnly
               />
            </MainPanel.Field>

         </MainPanel>

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
      </form>
   );
};