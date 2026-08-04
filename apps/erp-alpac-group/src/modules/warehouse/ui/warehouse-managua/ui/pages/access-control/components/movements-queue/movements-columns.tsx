import { Badges, Button, type TableColumn } from "@alpac/design-system";
import { EyeIcon } from "lucide-react";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { formatTime } from "@app/shared/utils/string.utils";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";

type MovementsColumnsOptions = {
  onDetailClick?: (item: ReceptionEntranceListItem) => void;
};
export function getMovementsColumns({
  onDetailClick,
}: MovementsColumnsOptions = {}): TableColumn<ReceptionEntranceListItem>[] {
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
      key: "arrival_time",
      label: "Hora de ingreso del registro",
      render: (item) => {
        return formatTime(item.arrival_time) || "—";
      },
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => resolveDocumentTypeLabel(item.document_type) || "—",
    },
    {
      key: "status",
      label: "Estado de mercancía",
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
