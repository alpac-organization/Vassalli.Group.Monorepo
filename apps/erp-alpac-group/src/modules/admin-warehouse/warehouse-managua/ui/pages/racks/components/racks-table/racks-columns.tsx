import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import { RackStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type RacksColumnsOptions = {
  onViewPositions: (rack: RackListItemResponse) => void;
  lastItemId?: string;
};

export function getRacksColumns({
  onViewPositions,
  lastItemId,
}: RacksColumnsOptions): TableColumn<RackListItemResponse>[] {
  return [
    {
      key: "code",
      label: "Código",
      render: (item) => item.code || "—",
    },
    {
      key: "level_number",
      label: "Nivel",
      render: (item) => item.level_number,
    },
    {
      key: "row_number",
      label: "Fila",
      render: (item) => item.row_number,
    },
    {
      key: "positions",
      label: "Posiciones",
      render: (item) => (
        <span>
          {item.occupied_positions} / {item.total_positions}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => <RackStatusBadge value={item.status ?? ""} />,
    },
    {
      key: "action",
      label: "Acciones",
      render: (item) => (
        <ContextMenu
          items={[
            {
              label: "Ver posiciones",
              onClick: () => onViewPositions(item),
            },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.rack_id === lastItemId}
        />
      ),
    },
  ];
}
