import {
  Badges,
  ContextMenu,
  type TableColumn,
} from "@alpac/design-system";
import type { WarehouseAssignmentListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import { WarehouseTypeEnum } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { getDocumentTypeBadgeClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/utils/merchandise-columns.utils";
import {
  formatDateToSpanishWords,
  formatTime,
} from "@app/shared/utils/string.utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function resolveWarehouseTypeLabel(value: number): string {
  const option = Object.values(WarehouseTypeEnum).find((o) => o.value === value);
  return option?.label ?? "—";
}

function formatAssignedAt(value: string): string {
  if (!value) return "—";
  const date = formatDateToSpanishWords(value.slice(0, 10));
  const time = formatTime(value.slice(11, 16));
  return [date, time].filter(Boolean).join(" ");
}

type AssignmentsColumnsOptions = {
  onDetailClick?: (item: WarehouseAssignmentListItem) => void;
  lastItemId?: string;
};

export function getAssignmentsColumns({
  onDetailClick,
  lastItemId,
}: AssignmentsColumnsOptions = {}): TableColumn<WarehouseAssignmentListItem>[] {
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
      key: "warehouse_name",
      label: "Bodega",
      render: (item) => item.warehouse_name || "—",
    },
    {
      key: "warehouse_type",
      label: "Tipo de bodega",
      render: (item) => resolveWarehouseTypeLabel(item.warehouse_type),
    },
    {
      key: "location",
      label: "Ubicación",
      render: (item) =>
        [item.section_code, item.rack_code, item.lot_code]
          .filter(Boolean)
          .join(" / ") || "—",
    },
    {
      key: "assigned_at",
      label: "Asignada",
      render: (item) => formatAssignedAt(item.assigned_at),
    },
    {
      key: "status",
      label: "Estado",
      render: (item) =>
        item.is_completed ? (
          <Badges label="Completada" color="success" />
        ) : (
          <Badges label="En descarga" color="warning" />
        ),
    },
    {
      key: "resources",
      label: "Cuadrilla / Máquinas",
      render: (item) => `${item.crew_count} pers. / ${item.machinery_count} máq.`,
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
          openUpOnMobile={item.reception_id === lastItemId}
        />
      ),
    },
  ];
}