import { Badges, Button, type TableColumn } from "@alpac/design-system";
import { EyeIcon } from "lucide-react";
import type { DataAccessControl } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";
type MovementsColumnsOptions = {
  onDetailClick?: (item: DataAccessControl) => void;
};

export function getMovementsColumns({
  onDetailClick,
}: MovementsColumnsOptions = {}): TableColumn<DataAccessControl>[] {
  return [
    {
      key: "plate_number",
      label: "Placa",
      render: (item) => item.plate_number || "—",
    },
    {
      key: "driver_name",
      label: "Conductor",
      render: (item) => item.driver_name || "—",
    },
    {
      key: "reception_start_date",
      label: "fecha de ingreso",
      render(item) {
        return formatDate(item.reception_start_date);
      },
    },
    {
      key: "reception_start_time",
      label: "Hora de ingreso del registro",
      render(item) {
        return formatTime(item.reception_start_time);
      },
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
