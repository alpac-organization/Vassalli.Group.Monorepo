import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { MainPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/main-panel/main-panel";
import { BanIcon, CheckIcon, XIcon } from "lucide-react";
import { DonatedVacationPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/donated-vacation-panel/donated-vacation-panel";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { ManagerPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/manager-panel/manager-panel";
import { AdministratorPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/administrator-panel/administrator-panel";
import { MedicalAppointmentPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/medical-appointment-panel/medical-appointment-panel";
import { VacationPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/vacation-panel/vacation-panel";
import { usePermission } from "@app/modules/payroll/ui/hooks/permission/usePermission";
import { PermitApplicationStatus } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";

export const ManagerForm = ({ application }: { application: GetApplicationsResponse }) => {

   const { companyId, moduleCode } = useUserStore();
   const { ProcessApplication } = useApplications();
   const { cancelPermissionRequestMutation } = usePermission();
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

   const isPendingApplication = PermitApplicationStatus[application.status] === PermitApplicationStatus.Pending;

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
   };

   const cancelApplication = (data: CancelPermissionRequest) => {
      cancelPermissionRequestMutation.mutate(data, {
         onSuccess: () => {
            setConfirmModal({ isOpen: false, type: "CANCEL" });
            setShowAlert({
               show: true,
               type: "success",
               title: "Solicitud cancelada",
               message: "La solicitud ha sido cancelada exitosamente."
            });

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
   };

   const openConfirm = (type: ConfirmActionType) => {
      setValue("is_approved", type === "APPROVE");
      setConfirmModal({ isOpen: true, type });
   };

   const handleCloseAlert = useCallback(() => {
      setTimeout(() => {
         setShowAlert({ show: false, type: "info", title: "", message: "" });
      }, 3000);
   }, []);

   const handleConfirmProcessApplication = handleSubmit(processApplication);

   const handleConfirmAction = () => {
      if (confirmModal.type === "CANCEL") {
         cancelApplication({
            company_id: companyId,
            module_code: moduleCode,
            permit_application_id: application.permit_apllication_id,
         });
      } else {
         handleConfirmProcessApplication();
      }
   };

   return (
      <form className="flex flex-col gap-4">
         <MainPanel
            application={application}
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {
               application.type === "Vacation" && (
                  <VacationPanel application={application} />
               )
            }

            {
               application.type === "MedicalAppointment" && (
                  <MedicalAppointmentPanel application={application} />
               )
            }

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

            <ManagerPanel application={application} />

            <AdministratorPanel application={application} />

            <MainPanel.Field label="Motivo o Descripción" className="font-semibold! rounded-md! text-[15px]">
               {application.description || "Sin descripción"}
            </MainPanel.Field>

         </MainPanel>

         {
            application.firts_step_approved === null && isPendingApplication && (
               <div className="flex flex-row col-span-full gap-4">
                  <Button
                     type="button"
                     label="Cancelar"
                     className="rounded-md! border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40"
                     onClick={() => openConfirm("CANCEL")}
                     icon={<BanIcon size={20} />}
                     isHiddenLabelOnMobile
                     disabled={cancelPermissionRequestMutation.isPending}
                     isLoading={cancelPermissionRequestMutation.isPending}
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
               onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
            />
         </AnimatedAlertWrapper>

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, type: "CANCEL" })}
            type={confirmModal.type}
            isLoading={ProcessApplication.isPending || cancelPermissionRequestMutation.isPending}
            disabled={ProcessApplication.isPending || cancelPermissionRequestMutation.isPending}
            handleFinalAction={() => handleConfirmAction()}
         />
      </form>
   );
}