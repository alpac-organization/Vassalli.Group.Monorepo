import type { MovementStatus } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";

export const STATUS_BADGE_CLASS: Record<MovementStatus, string> = {
  PENDIENTE:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  COMPLETADO:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
};
