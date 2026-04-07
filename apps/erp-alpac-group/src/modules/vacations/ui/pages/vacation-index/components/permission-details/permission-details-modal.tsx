import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import type { PermissionHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/permission-history-response";
import { derivePermissionRequestDetails } from "@app/modules/vacations/ui/pages/vacation-index/utils/permission-details-view-state";
import { PermissionRequestDetailsContent } from "./permission-details-content";

type PermissionRequestDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: PermissionHistoryResponse | null;
  collaboratorFullName: string;
};

export function PermissionRequestDetailsModal({
  isOpen,
  onClose,
  item,
  collaboratorFullName,
}: PermissionRequestDetailsModalProps) {
  const details = useMemo(() => {
    if (!item) return null;
    return derivePermissionRequestDetails(item, collaboratorFullName);
  }, [item, collaboratorFullName]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la Solicitud de Permiso"
      panelClassName={[
        "!max-w-2xl w-full min-w-0",
        "max-h-[min(92dvh,44rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
        "!mx-3 !my-4 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        "[scrollbar-gutter:stable]",
      ].join(" ")}
    >
      {details && <PermissionRequestDetailsContent details={details} />}
    </Modal>
  );
}
