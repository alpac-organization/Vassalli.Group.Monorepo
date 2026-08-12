import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import type { MerchandiseRegisterItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { getDocumentTypeBadgeClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/utils/merchandise-columns.utils";
import {
  formatTime,
  formatDateToSpanishWords,
} from "@app/shared/utils/string.utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type MerchandiseColumnsOptions = {
  onDetailClick?: (item: MerchandiseRegisterItem) => void;
  lastItemId?: string;
};

export function getMerchandiseColumns({
  onDetailClick,
  lastItemId,
}: MerchandiseColumnsOptions = {}): TableColumn<MerchandiseRegisterItem>[] {
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
      key: "container_number",
      label: "Contenedor",
      render: (item) => item.container_number || "—",
    },
    {
      key: "arrival_date",
      label: "Fecha de llegada",
      render: (item) => formatDateToSpanishWords(item.arrival_date) || "—",
    },
    {
      key: "arrival_time",
      label: "Hora de llegada",
      render: (item) => formatTime(item.arrival_time) || "—",
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => {
        const label = resolveDocumentTypeLabel(item.document_type);
        if (!label) return "—";

        return (
          <div className="w-[7.5rem]">
            <Badges
              label={label}
              color="transparent"
              className={`w-full! justify-center! ${getDocumentTypeBadgeClass(item.document_type)}`}
            />
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <ContextMenu
          items={[
            { label: "Ver detalle", onClick: () => onDetailClick?.(item) },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.id === lastItemId}
        />
      ),
    },
  ];
}
