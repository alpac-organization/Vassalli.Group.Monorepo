import type { MovementQueueItem } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";

export type MovementDetailModalProps = {
  isOpen: boolean;
  movement: MovementQueueItem | null;
  onClose: () => void;
};
