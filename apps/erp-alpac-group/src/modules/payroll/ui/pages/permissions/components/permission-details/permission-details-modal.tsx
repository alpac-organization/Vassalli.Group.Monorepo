import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Button,
  AnimatedAlertWrapper,
  Alert,
} from "@alpac/design-system";
import { CheckIcon, XIcon } from "lucide-react";
import { derivePermissionRequestDetails } from "@app/modules/payroll/ui/pages/permissions/utils/permission-details-view-state";
import { PermissionRequestDetailsContent } from "@app/modules/payroll/ui/pages/permissions/components/permission-details/permission-details-content";
import type { PermissionRequestDetailsModalProps } from "@app/modules/payroll/ui/pages/permissions/components/permission-details/types/permission-details-modal.type";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { ConfirmModal } from "@app/modules/applications/ui/pages/applications-index/components/confirm-modal/confirm-modal";
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";

export function PermissionRequestDetailsModal({
  isOpen,
  onClose,
  item,
  collaboratorFullName,
}: PermissionRequestDetailsModalProps) {
  const { role, companyId, moduleCode } = useUserStore();
  const { ProcessApplication } = useApplications();
  const { getMappedError } = useMappedError();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ConfirmActionType;
  }>({
    isOpen: false,
    type: "CANCEL",
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

  const details = useMemo(() => {
    if (!item) return null;
    return derivePermissionRequestDetails(item, collaboratorFullName);
  }, [item, collaboratorFullName]);

  const canProcess = useMemo(() => {
    if (!item) return false;
    const isManager = role === RoleEnum.MANAGER;
    const isPending = item.status === "Pending";
    const firstStepNotProcessed = item.first_step_status.is_approved === null;

    return isManager && isPending && firstStepNotProcessed;
  }, [item, role]);

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

  const processApplication = (isApproved: boolean) => {
    if (!item) return;

    ProcessApplication.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        permit_application_id: item.permit_apllication_id,
        is_approved: isApproved,
      },
      {
        onSuccess: () => {
          setConfirmModal({ isOpen: false, type: "CANCEL" });
          onClose?.();
        },
        onError: (error) => {
          const mappedError = getMappedError(error);
          setShowAlert({
            show: true,
            type: "error",
            title: "Error",
            message: mappedError.description,
          });

          handleCloseAlert();
        },
      },
    );
  };

  const openConfirm = (type: ConfirmActionType) => {
    setConfirmModal({ isOpen: true, type });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "APPROVE") {
      processApplication(true);
    } else if (confirmModal.type === "REJECT") {
      processApplication(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la Solicitud de Permiso"
      panelClassName={[
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6">
        {details && <PermissionRequestDetailsContent details={details} />}

        {canProcess && (
          <div className="flex flex-row justify-end gap-3 pt-2">
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
      </div>

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
        isLoading={ProcessApplication.isPending}
        disabled={ProcessApplication.isPending}
        handleFinalAction={handleConfirmAction}
      />
    </Modal>
  );
}
