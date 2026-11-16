import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Textarea } from "@alpac/design-system";
import { BanIcon, CheckIcon, XIcon } from "lucide-react";
import { ApplicationConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/application-confirm-modal/application-confirm-modal";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { MainPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/main-panel/main-panel";
import { ManagerPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/manager-panel/manager-panel";
import { AdministratorPanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/administrator-panel/administrator-panel";
import { LeavePanel } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/leave-panel/leave-panel";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePermission } from "@app/modules/payroll/ui/hooks/permission/usePermission";
import { PermitApplicationStatus } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import {
  ConfirmActionValueMap,
  type ConfirmActionType,
} from "@app/shared/components/confirm-modal/confirm-modal.types";

import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";
import type { LeaveFormProps } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/leave-form/leave-form.types";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";

export const LeaveApplicationForm = (props: LeaveFormProps) => {
  const { application, onFinishProcess } = props;
  const { companyId, moduleCode } = useUserStore();
  const { ProcessApplication } = useApplications();
  const { cancelPermissionRequestMutation } = usePermission();
  const { handleRequestSuccess, handleRequestError, AlertComponent } =
    useAlertState();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ConfirmActionType;
  }>({
    isOpen: false,
    type: "CANCEL",
  });

  const { handleSubmit, setValue } = useForm<ApplicationProcessRequest>({
    defaultValues: {
      company_id: companyId,
      module_code: moduleCode,
      permit_application_id: application.permit_apllication_id,
      is_approved: null,
    },
  });

  const isPendingApplication =
    PermitApplicationStatus[application.status] ===
    PermitApplicationStatus.Pending;

  const processApplication = (data: ApplicationProcessRequest) => {
    ProcessApplication.mutate(data, {
      onSuccess: () => {
        const action = data.is_approved ? "Aprobada" : "Rechazada";
        setConfirmModal({ isOpen: false, type: "CANCEL" });
        handleRequestSuccess(
          `La solicitud ha sido ${action} exitosamente.`,
          "Solicitud procesada",
        );

        setTimeout(() => {
          onFinishProcess?.();
        }, 1000);
      },
      onError: (error) => {
        handleRequestError(error);
      },
    });
  };

  const cancelApplication = (data: CancelPermissionRequest) => {
    cancelPermissionRequestMutation.mutate(data, {
      onSuccess: () => {
        setConfirmModal({ isOpen: false, type: "CANCEL" });
        handleRequestSuccess(
          "La solicitud ha sido cancelada exitosamente.",
          "Solicitud cancelada",
        );

        setTimeout(() => {
          onFinishProcess?.();
        }, 1000);
      },
      onError: (error) => {
        handleRequestError(error);
      },
    });
  };

  const openConfirm = (type: ConfirmActionType) => {
    const value = type ? ConfirmActionValueMap[type] : null;
    setValue("is_approved", value);
    setConfirmModal({ isOpen: true, type });
  };

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
    <form className="flex flex-col gap-6">
      <MainPanel
        application={application}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        <LeavePanel application={application} />

        <ManagerPanel application={application} />

        <AdministratorPanel application={application} />

        <MainPanel.Field label="Motivo o Descripción" className="col-span-full">
          <Textarea
            className="rounded-md"
            value={application.description || "Sin descripción"}
            readOnly
          />
        </MainPanel.Field>
      </MainPanel>

      {application.second_step_status.is_approved === null &&
        isPendingApplication && (
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              label="Cancelar"
              className="rounded-md! h-11 px-6! border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40"
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
        )}

      {AlertComponent}

      <ApplicationConfirmModal
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
