import { useEffect } from "react";
import { Modal } from "@alpac/design-system";
import { usePermission } from "@app/modules/vacations/ui/hooks/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { NewPermissionRequestCollaboratorSummary } from "./new-permission-request-collaborator-summary";
import { NewPermissionRequestForm } from "./new-permission-request-form";

type NewPermissionRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  collaboratorFullName: string;
  collaboratorWorkPosition: string;
  isCollaboratorFullNameLoading?: boolean;
  isCollaboratorWorkPositionLoading?: boolean;
  onRequestSuccess?: () => void;
  onRequestError?: (description: string) => void;
};

export function NewPermissionRequestModal({
  isOpen,
  onClose,
  collaboratorFullName,
  collaboratorWorkPosition,
  isCollaboratorFullNameLoading = false,
  isCollaboratorWorkPositionLoading = false,
  onRequestSuccess,
  onRequestError,
}: NewPermissionRequestModalProps) {
  const { companyId, moduleCode, identificationNumber } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { createPermissionRequestMutation } = usePermission();

  const handleSubmit = (payload: CreatePermissionRequest) => {
    createPermissionRequestMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        onRequestSuccess?.();
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        onClose();
        onRequestError?.(
          apiError.error?.description ?? "Ocurrió un error inesperado.",
        );
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Solicitud de Permiso"
      panelClassName={[
        "!max-w-2xl w-full min-w-0",
        "max-h-[min(92dvh,44rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
        "!mx-3 !my-4 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        "[scrollbar-gutter:stable]",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <NewPermissionRequestCollaboratorSummary
          fullName={collaboratorFullName}
          workPosition={collaboratorWorkPosition}
          isFullNameLoading={isCollaboratorFullNameLoading}
          isWorkPositionLoading={isCollaboratorWorkPositionLoading}
        />
        <NewPermissionRequestForm
          isPending={createPermissionRequestMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
          companyId={companyId}
          moduleCode={moduleCode}
          identificationNumber={identificationNumber}
        />
      </div>
    </Modal>
  );
}
