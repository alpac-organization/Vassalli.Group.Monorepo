import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@alpac/design-system";
import { MainPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/main-panel/main-panel";
import { CheckIcon, XIcon } from "lucide-react";
import { DonatedVacationPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/donated-vacation-panel/donated-vacation-panel";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ConfirmModal } from "../../confirm-modal/confirm-modal";
import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import type { ConfirmActionType } from "../../../types/confirm-action.types";

export const ManagerForm = ({ application }: { application: GetApplicationsResponse }) => {

   const { companyId, moduleCode } = useUserStore();
   const { ApproveApplication, RejectApplication } = useApplications();

   const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: ConfirmActionType;
   }>({
      isOpen: false,
      type: null
   });

   const { handleSubmit, setValue } = useForm<ApplicationProcessRequest>({
      defaultValues: {
         company_id: companyId,
         module_code: moduleCode,
         permit_application_id: application.permit_apllication_id,
         is_approved: null
      }
   });

   const onInternalSubmit = (data: ApplicationProcessRequest) => {
      if (data.is_approved) {
         ApproveApplication.mutate(data, {
            onSuccess: () => setConfirmModal({ isOpen: false, type: null })
         });
      } else {
         RejectApplication.mutate(data, {
            onSuccess: () => setConfirmModal({ isOpen: false, type: null })
         });
      }
   };

   const openConfirm = (type: ConfirmActionType) => {
      setValue("is_approved", type === "APPROVE");
      setConfirmModal({ isOpen: true, type });
   };

   return (
      <form className="flex flex-col gap-4">
         <MainPanel
            application={application}
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {
               application.type === "DonatedVacations" && (
                  <>
                     <DonatedVacationPanel application={application} />
                     <MainPanel.Field label="Días Donados" className="font-semibold! rounded-md! text-[15px]">
                        {application.amount_days === 0 ? "Sin días donados" : application.amount_days}
                     </MainPanel.Field>
                  </>
               )
            }

            <MainPanel.Field label="Motivo o Descripción" className="font-semibold! rounded-md! text-[15px]">
               {application.description || "Sin descripción"}
            </MainPanel.Field>

         </MainPanel>

         <div className="flex flex-row col-span-full gap-4">
            <Button
               type="button"
               label="Rechazar Solicitud"
               className="rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
               onClick={() => openConfirm("REJECT")}
               icon={<XIcon size={20} />}
               isHiddenLabelOnMobile
               disabled={ApproveApplication.isPending || RejectApplication.isPending}
            />
            <Button
               type="button"
               label="Aprobar Solicitud"
               className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200"
               onClick={() => openConfirm("APPROVE")}
               icon={<CheckIcon size={20} />}
               isHiddenLabelOnMobile
               disabled={ApproveApplication.isPending || RejectApplication.isPending}
            />
         </div>

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, type: null })}
            type={confirmModal.type}
            isLoading={ApproveApplication.isPending || RejectApplication.isPending}
            disabled={ApproveApplication.isPending || RejectApplication.isPending}
            handleFinalAction={() => handleSubmit(onInternalSubmit)()}
         />
      </form>
   );
}