import { Modal } from "@alpac/design-system";
import type { MovementDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";

export function MovementDetailModal({
  isOpen,
  movement,
  onClose,
}: MovementDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        movement
          ? `Detalle — ${movement.serviceOrder}`
          : "Detalle del movimiento"
      }
      variant="info"
      size="2xl"
    >
      <div className="min-h-[120px]" />
    </Modal>
  );
}
