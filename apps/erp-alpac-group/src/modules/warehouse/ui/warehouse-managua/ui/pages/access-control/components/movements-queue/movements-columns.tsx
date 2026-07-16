import { Badges, Button, type TableColumn } from "@alpac/design-system";
import { EyeIcon } from "lucide-react";
import type { MovementQueueItem } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import { STATUS_BADGE_CLASS } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";

type MovementsColumnsOptions = {
  onDetailClick?: (item: MovementQueueItem) => void;
};

export function getMovementsColumns({
  onDetailClick,
}: MovementsColumnsOptions = {}): TableColumn<MovementQueueItem>[] {
  return [
    { key: "serviceOrder", label: "Orden Servicio" },
    { key: "placaCabezal", label: "Placa Cabezal" },
    { key: "driver", label: "Conductor" },
    { key: "consignee", label: "Consignatario" },
    { key: "entry", label: "Ingreso" },
    {
      key: "status",
      label: "Estado",
      render: (item) => (
        <Badges
          label={item.status}
          color="transparent"
          className={STATUS_BADGE_CLASS[item.status]}
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <Button
          type="button"
          size="small"
          icon={<EyeIcon size={16} />}
          onClick={() => onDetailClick?.(item)}
          className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          label="Ver detalle"
          ariaLabel="Ver detalle"
        />
      ),
    },
  ];
}
