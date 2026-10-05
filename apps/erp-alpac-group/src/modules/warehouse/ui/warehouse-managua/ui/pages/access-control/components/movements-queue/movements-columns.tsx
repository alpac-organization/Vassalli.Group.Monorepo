import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type MovementsColumnsOptions = {
  onDetailClick?: (item: ReceptionEntranceListItem) => void;
  onExitClick?: (item: ReceptionEntranceListItem) => void;
  onDeleteClick?: (item: ReceptionEntranceListItem) => void;
  lastItemId?: string;
};
export function getMovementsColumns({
  onDetailClick,
  onExitClick,
  onDeleteClick,
  lastItemId,
}: MovementsColumnsOptions = {}): TableColumn<ReceptionEntranceListItem>[] {
  return [
    {
      key: "reception_code",
      label: "Código",
      render: (item) => item.reception_code || "—",
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => item.document_type?.toString() || "—",
    },
    {
      key: "vehicle_plate_number",
      label: "Placa del vehículo",
      render: (item) => item.vehicle_plate_number || "—",
    },
    {
      key: "container_number",
      label: "Número de contenedor",
      render: (item) => item.container_number || "—",
    },
    {
      key: "seal_number",
      label: "Número de marchamo",
      render: (item) => item.seal_number || "—",
    },
    {
      key: "country_of_origin",
      label: "País de origen",
      render: (item) => item.country_of_origin || "—",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <ContextMenu
          items={[
            { label: "Ver detalle", onClick: () => onDetailClick?.(item) },
            { label: "Dar salida", onClick: () => onExitClick?.(item) },
            { label: "Eliminar", onClick: () => onDeleteClick?.(item) },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.id === lastItemId}
        />
      ),
    },
  ];
}
