import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
  getVehicleStatusBadgeClass,
  getVehicleStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { formatTime } from "@app/shared/utils/string.utils";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type MovementsColumnsOptions = {
  onDetailClick?: (item: ReceptionEntranceListItem) => void;
  onExitClick?: (item: ReceptionEntranceListItem) => void;
  lastItemId?: string;
};
export function getMovementsColumns({
  onDetailClick,
  onExitClick,
  lastItemId,
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
      key: "vehicle_status",
      label: "Estado del registro",
      render: (item) => (
        <Badges
          label={getVehicleStatusBadgeLabel(item.vehicle_status)}
          color="transparent"
          className={getVehicleStatusBadgeClass(item.vehicle_status)}
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <ContextMenu
          items={[
            { label: "Ver detalle", onClick: () => onDetailClick?.(item) },
            { label: "Dar salida", onClick: () => onExitClick?.(item) },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.id === lastItemId}
        />
      ),
    },
  ];
}
