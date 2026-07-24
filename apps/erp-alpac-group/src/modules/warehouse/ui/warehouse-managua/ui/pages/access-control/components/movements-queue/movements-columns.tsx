import { Badges, Button, type TableColumn } from "@alpac/design-system";
import { EyeIcon } from "lucide-react";
import type { RecordEntrance } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";

type MovementsColumnsOptions = {
  onDetailClick?: (item: RecordEntrance) => void;
};

export function getMovementsColumns({
  onDetailClick,
}: MovementsColumnsOptions = {}): TableColumn<RecordEntrance>[] {
  return [
    {
      key: "plate_number",
      label: "Placa",
      render: (item) => item.reception_entrance?.plate_number || "—",
    },
    {
      key: "driver_name",
      label: "Conductor",
      render: (item) => item.reception_entrance?.driver_name || "—",
    },
    {
      key: "start_date",
      label: "Fecha de ingreso",
      render: (item) =>
        item.execution_log?.start_date
          ? formatDate(item.execution_log.start_date)
          : "—",
    },
    {
      key: "start_time",
      label: "Hora de ingreso del registro",
      render: (item) => formatTime(item.execution_log?.start_time),
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => (
        <Badges
          label={getStatusBadgeLabel(item.status)}
          color="transparent"
          className={getStatusBadgeClass(item.status)}
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
