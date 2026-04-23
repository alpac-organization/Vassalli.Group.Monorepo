import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import { derivePermissionRequestDetails } from "@app/modules/payroll/ui/pages/permissions/utils/permission-details-view-state";
import { PermissionRequestDetailsContent } from "@app/modules/payroll/ui/pages/permissions/components/permission-details/permission-details-content";
import type { PermissionRequestDetailsModalProps } from "@app/modules/payroll/ui/pages/permissions/components/permission-details/types/permission-details-modal.type";

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
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      {details && <PermissionRequestDetailsContent details={details} />}
    </Modal>
  );
}
