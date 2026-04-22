import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AnimatedAlertWrapper, Button, Textarea } from "@alpac/design-system";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import { BanIcon, CheckIcon, XIcon } from "lucide-react";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { MainPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/main-panel/main-panel";
import { ManagerPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/manager-panel/manager-panel";
import { AdministratorPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/administrator-panel/administrator-panel";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";

import { ConfirmActionValueMap, type ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";
import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";
import type { VacationFormProps } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/vacation-form/vacation-form.types";
import { VacationPanel } from "../../application-panels/vacation-panel/vacation-panel";

export const VacationForm = (props: VacationFormProps) => {

   const { application, onFinishProcess } = props;

   const { companyId, moduleCode } = useUserStore();
   const { ProcessApplication } = useApplications();
   const { getMappedError } = useMappedError();

   const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: ConfirmActionType;
   }>({
      isOpen: false,
      type: "CANCEL"
   });

   const [showAlert, setShowAlert] = useState<{
      show: boolean;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
   }>({
      show: false,
      type: "info",
      title: "",
      message: "",
   });

   const { handleSubmit, setValue } = useForm<ApplicationProcessRequest>({
      defaultValues: {
         company_id: companyId,
         module_code: moduleCode,
         permit_application_id: application.permit_apllication_id,
         is_approved: null
      }
   });

   const processApplication = (data: ApplicationProcessRequest) => {
      ProcessApplication.mutate(data, {
         onSuccess: () => {
            const action = data.is_approved ? "Aprobada" : "Rechazada";
            setConfirmModal({ isOpen: false, type: "CANCEL" });
            setShowAlert({
               show: true,
               type: "success",
               title: "Solicitud procesada",
               message: `La solicitud ha sido ${action} exitosamente.`
            });

            setTimeout(() => {
               onFinishProcess?.();
            }, 500);

            handleCloseAlert();
         },
         onError: (error) => {
            const mappedError = getMappedError(error);
            setShowAlert({
               show: true,
               type: "error",
               title: "Error",
               message: mappedError.description
            });

            handleCloseAlert();
         }
      });
   }

   const openConfirm = (type: ConfirmActionType) => {
      const value = type ? ConfirmActionValueMap[type] : null;
      setValue("is_approved", value);
      setConfirmModal({ isOpen: true, type });
   };

   const handleCloseAlert = useCallback(() => {
      setTimeout(() => {
         setShowAlert({ show: false, type: "info", title: "", message: "" });
      }, 3000);
   }, []);

   const handleConfirmAction = handleSubmit(processApplication);

   return (
      <form className="flex flex-col gap-6">

         <MainPanel application={application} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

            <VacationPanel application={application} />

            <ManagerPanel application={application} />

            <AdministratorPanel application={application} />

            <MainPanel.Field label="Motivo o Descripción" className="col-span-full">
               <Textarea
                  className="rounded-md"
                  value={application.description || 'Sin descripción'}
                  readOnly
               />
            </MainPanel.Field>

         </MainPanel>

         {
            application.second_step_approved === null && (
               <div className="flex justify-end gap-3">
                  <Button
                     type="button"
                     label="Cancelar"
                     className="rounded-md! border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40"
                     onClick={() => openConfirm("CANCEL")}
                     icon={<BanIcon size={20} />}
                     isHiddenLabelOnMobile
                     disabled={ProcessApplication.isPending}
                     isLoading={ProcessApplication.isPending}
                  />
                  <Button
                     type="button"
                     label="Rechazar"
                     className="rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
                     onClick={() => openConfirm("REJECT")}
                     icon={<XIcon size={20} />}
                     isHiddenLabelOnMobile
                     disabled={ProcessApplication.isPending}
                     isLoading={ProcessApplication.isPending}
                  />
                  <Button
                     type="button"
                     label="Aprobar"
                     className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200"
                     onClick={() => openConfirm("APPROVE")}
                     icon={<CheckIcon size={20} />}
                     isHiddenLabelOnMobile
                     disabled={ProcessApplication.isPending}
                     isLoading={ProcessApplication.isPending}
                  />
               </div>
            )
         }

         <AnimatedAlertWrapper open={showAlert.show}>
            <Alert
               type={showAlert.type}
               title={showAlert.title}
               message={showAlert.message}
               showCloseButton
               onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
            />
         </AnimatedAlertWrapper>

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, type: "CANCEL" })}
            type={confirmModal.type}
            isLoading={ProcessApplication.isPending}
            disabled={ProcessApplication.isPending}
            handleFinalAction={() => handleConfirmAction()}
         />
      </form>
   );
};