import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import type { VacationHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-history-response";
import { deriveVacationRequestDetails } from "@app/modules/vacations/ui/pages/vacation-index/utils/vacation-details-view-state";
import { VacationRequestDetailsContent } from "./vacation-request-details-content";

type VacationRequestDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: VacationHistoryResponse | null;
  collaboratorFullName: string;
};

export function VacationRequestDetailsModal({
  isOpen,
  onClose,
  item,
  collaboratorFullName,
}: VacationRequestDetailsModalProps) {
  const details = useMemo(() => {
    if (!item) return null;
    return deriveVacationRequestDetails(item, collaboratorFullName);
  }, [item, collaboratorFullName]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la Solicitud de Vacaciones"
      panelClassName={[
        "!max-w-2xl w-full min-w-0",
        "max-h-[min(92dvh,44rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
        "!mx-3 !my-4 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        "[scrollbar-gutter:stable]",
      ].join(" ")}
    >
      {details && <VacationRequestDetailsContent details={details} />}
    </Modal>
  );
}
