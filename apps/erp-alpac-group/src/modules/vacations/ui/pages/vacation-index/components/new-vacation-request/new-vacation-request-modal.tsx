import { useEffect } from "react";
import { Modal } from "@alpac/design-system";
import { useCreateVacationRequest } from "@app/modules/vacations/ui/hooks/useCreateVacationRequest";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";
import { NewVacationRequestCollaboratorSummary } from "./new-vacation-request-collaborator-summary";
import { NewVacationRequestForm } from "./new-vacation-request-form";

type NewVacationRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  collaboratorFullName: string;
  collaboratorWorkPosition: string;
  isCollaboratorFullNameLoading?: boolean;
  isCollaboratorWorkPositionLoading?: boolean;
};

export function NewVacationRequestModal({
  isOpen,
  onClose,
  collaboratorFullName,
  collaboratorWorkPosition,
  isCollaboratorFullNameLoading = false,
  isCollaboratorWorkPositionLoading = false,
}: NewVacationRequestModalProps) {
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

  const { createVacationRequestMutation } = useCreateVacationRequest();

  const handleSubmit = (payload: CreateVacationRequest) => {
    createVacationRequestMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Solicitud de Vacaciones"
      panelClassName={[
        "!max-w-2xl w-full min-w-0",
        "max-h-[min(92dvh,44rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
        "!mx-3 !my-4 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        "[scrollbar-gutter:stable]",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <NewVacationRequestCollaboratorSummary
          fullName={collaboratorFullName}
          workPosition={collaboratorWorkPosition}
          isFullNameLoading={isCollaboratorFullNameLoading}
          isWorkPositionLoading={isCollaboratorWorkPositionLoading}
        />
        <NewVacationRequestForm
          isPending={createVacationRequestMutation.isPending}
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
