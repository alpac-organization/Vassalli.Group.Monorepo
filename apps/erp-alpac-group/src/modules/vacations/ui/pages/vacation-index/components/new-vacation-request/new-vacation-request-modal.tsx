import { useEffect } from "react";
import { Modal } from "@alpac/design-system";
import { useCreateVacationRequest } from "@app/modules/vacations/ui/hooks/useCreateVacationRequest";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";
import { NewVacationRequestForm } from "./new-vacation-request-form";

type NewVacationRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewVacationRequestModal({
  isOpen,
  onClose,
}: NewVacationRequestModalProps) {
  const { companyId, moduleCode, identificationNumber, fullName, role } =
    useUserStore();

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
      panelClassName="!max-w-2xl"
    >
      <NewVacationRequestForm
        isPending={createVacationRequestMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
        companyId={companyId}
        moduleCode={moduleCode}
        identificationNumber={identificationNumber}
        fullName={fullName}
        cargo={role}
      />
    </Modal>
  );
}
