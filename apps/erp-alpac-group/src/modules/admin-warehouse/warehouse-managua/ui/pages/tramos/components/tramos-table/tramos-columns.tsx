import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type TramosColumnsOptions = {
  onViewDetail: (lot: LotListItemResponse) => void;
  lastItemId?: string;
};

export function getTramosColumns({
  onViewDetail,
  lastItemId,
}: TramosColumnsOptions): TableColumn<LotListItemResponse>[] {
  return [
    {
      key: "code",
      label: "Código",
      render: (item) => item.code || "—",
    },
    {
      key: "width_metres",
      label: "Ancho (m)",
      render: (item) => item.width_metres,
    },
    {
      key: "length_metres",
      label: "Largo (m)",
      render: (item) => item.length_metres,
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
      render: (item) => <RackStatusBadge value={item.status} />,
    },
    {
      key: "action",
      label: "Acciones",
      render: (item) => (
        <ContextMenu
          items={[
            {
              label: "Ver detalle",
              onClick: () => onViewDetail(item),
            },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.lot_id === lastItemId}
        />
      ),
    },
  ];
}
