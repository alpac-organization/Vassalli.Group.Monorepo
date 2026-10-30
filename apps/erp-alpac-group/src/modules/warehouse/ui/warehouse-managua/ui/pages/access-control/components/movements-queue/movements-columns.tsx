import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

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
      key: "reception_code",
      label: "Código",
      render: (item) => item.reception_code || "—",
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => resolveDocumentTypeLabel(item.document_type) || "—",
    },
    {
      key: "vehicle_plate_number",
      label: "Placa del vehículo",
      render: (item) => (
        <span className="inline-flex items-center gap-2">
          {item.vehicle_plate_number || "—"}
          {item.vehicle_plate_number ? (
            item.vehicle_exit_time ? (
              <FontAwesomeIcon icon={faLocationArrow} style={{ color: "rgb(255, 0, 0)", transform: "rotate(-45deg)" }} />
            ) : (
              <FontAwesomeIcon icon={faLocationArrow} style={{ color: "rgb(0, 255, 0)", transform: "rotate(135deg)" }} />
            )
          ) : null}
        </span>
      ),
    },
    {
      key: "container_number",
      label: "Número de contenedor",
      render: (item) => (
        <span className="inline-flex items-center gap-2">
          {item.container_number || "—"}
          {item.container_number ? (
            item.container_exit_time ? (
              <FontAwesomeIcon icon={faLocationArrow} style={{ color: "rgb(255, 0, 0)", transform: "rotate(-45deg)" }} />
            ) : (
              <FontAwesomeIcon icon={faLocationArrow} style={{ color: "rgb(0, 255, 0)", transform: "rotate(135deg)" }} />
            )
          ) : null}
        </span>
      ),
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
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.id === lastItemId}
        />
      ),
    },
  ];
}
