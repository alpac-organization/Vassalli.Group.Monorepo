import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import {
  RackStatusBadge,
  StackingBadge,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import { formatAreaM2 } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/lot-area.utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type TramosColumnsOptions = {
  onViewDetail: (lot: LotDto) => void;
  lastItemId?: string;
};

export function getTramosColumns({
  onViewDetail,
  lastItemId,
}: TramosColumnsOptions): TableColumn<LotDto>[] {
  return [
    {
      key: "code",
      label: "Código",
      render: (item) => item.code || "—",
    },
    {
      key: "allows_stacking",
      label: "Estibado",
      render: (item) => <StackingBadge allowsStacking={item.allows_stacking} />,
    },
    {
      key: "dimensions",
      label: "Dimensiones",
      render: (item) => (
        <div className="flex flex-col text-xs">
          <span>Ancho: {item.width} m</span>
          <span>Largo: {item.length} m</span>
          <span className="text-slate-500 dark:text-slate-400">
            Área: {formatAreaM2(item.area)}
          </span>
        </div>
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
              label: "Ver detalles",
              onClick: () => onViewDetail(item),
            },
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.id === lastItemId}
        />
      ),
    },
  ];
}
