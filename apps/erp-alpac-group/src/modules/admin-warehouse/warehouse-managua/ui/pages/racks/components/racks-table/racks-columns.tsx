import { ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import {RackStatusBadge,RackUsageProfileBadge,} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import type { RacksColumnsOptions } from "./types/racks-table.types";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function getRackActionItems(
  item: RackDto,
  onViewPositions: RacksColumnsOptions["onViewPositions"],
  onUpdateRack: RacksColumnsOptions["onUpdateRack"],
  onDeleteRack: RacksColumnsOptions["onDeleteRack"],
): ContextMenuItem[] {
  return [
    {
      label: "Ver detalle y stock",
      onClick: () => onViewPositions(item),
    },
    {
      label: "Actualizar",
      onClick: () => onUpdateRack(item),
    },
    {
      label: "Eliminar",
      onClick: () => onDeleteRack(item),
    },
  ];
}

export function getRacksColumns({
  onViewPositions,
  onUpdateRack,
  onDeleteRack,
  lastItemId,
}: RacksColumnsOptions): TableColumn<RackDto>[] {
  return [
    {
      key: "code",
      label: "Código",
      render: (item) => item.code || "—",
    },
    {
      key: "row_level",
      label: "Hilera / Nivel",
      render: (item) => `Hilera ${item.row_number} • Nivel ${item.level_number}`,
    },
    {
      key: "usage_profile",
      label: "Perfil",
      render: (item) => <RackUsageProfileBadge value={item.usage_profile} />,
    },
    {
      key: "positions",
      label: "Polines",
      render: (item) => (
        <span>
          {item.occupied_positions} / {item.total_positions || item.max_pulleys || 2}
        </span>
      ),
    },
    {
      key: "dimensions",
      label: "Medidas (L×A)",
      render: (item) => {
        const length = item.length;
        const width = item.width;
        if (!length || !width) return "—";
        return `${length}m × ${width}m`;
      },
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => <RackStatusBadge value={item.status} />,
    },
    {
      key: "action",
      label: "Acciones",
      render: (item) => {
        const items = getRackActionItems(
          item,
          onViewPositions,
          onUpdateRack,
          onDeleteRack,
        );

        const currentId = item.rack_id;

        return (
          <ContextMenu
            items={items}
            triggerClassName={contextMenuButton}
            openUpOnMobile={currentId === lastItemId}
          />
        );
      },
    },
  ];
}
