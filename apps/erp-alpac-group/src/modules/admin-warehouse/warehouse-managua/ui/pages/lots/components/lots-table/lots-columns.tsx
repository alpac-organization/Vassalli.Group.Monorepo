import { ContextMenu, type TableColumn } from "@alpac/design-system";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import {
  RackStatusBadge,
  StackingBadge,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import { LotCapacityCell } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/lot-capacity-cell";
import { formatAreaM2 } from "@app/modules/warehouse/ui/view/warehouse/utils/warehouse-utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type TramosColumnsOptions = {
  onViewDetail: (lot: LotListItemResponse) => void;
  lastItemId?: string;
  capacitiesByLotId?: Record<string, LotCapacitiesResponse | undefined>;
  capacitiesLoading?: boolean;
};

export function getTramosColumns({
  onViewDetail,
  lastItemId,
  capacitiesByLotId = {},
  capacitiesLoading = false,
}: TramosColumnsOptions): TableColumn<LotListItemResponse>[] {
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
      render: (item) => {
        const capacity = capacitiesByLotId[item.id];

        if (!capacity) {
          return (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {capacitiesLoading ? "…" : "—"}
            </span>
          );
        }

        return (
          <div className="flex flex-col text-xs">
            <span>Ancho: {capacity.width} m</span>
            <span>Largo: {capacity.length} m</span>
            <span className="text-slate-500 dark:text-slate-400">
              Área: {formatAreaM2(capacity.total_area_m2)}
            </span>
          </div>
        );
      },
    },
    {
      key: "capacity",
      label: "Capacidad",
      render: (item) => (
        <LotCapacityCell
          capacity={capacitiesByLotId[item.id]}
          isLoading={capacitiesLoading}
        />
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
              label: "Ver detalle",
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