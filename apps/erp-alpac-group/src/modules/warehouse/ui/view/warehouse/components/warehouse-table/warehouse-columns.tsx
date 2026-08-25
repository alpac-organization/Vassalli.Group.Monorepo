import { ContextMenu, type TableColumn } from "@alpac/design-system";
import { CornerDownRight } from "lucide-react";
import type { Capacity } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/skeleton-table";
import { OwnerBadge } from "@app/modules/warehouse/ui/view/warehouse/components/badges/owner-badge";
import type { WarehouseColumnsOptions } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/types/warehouse-table.types";
import { ActiveStatusBadge } from "@app/modules/warehouse/ui/view/warehouse/components/badges/active-status-badge";
import { WarehouseTableSkeletonCell } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/warehouse-table-skeleton";
import {
  formatAreaM2,
  getOccupancyBarColor,
} from "@app/modules/warehouse/ui/view/warehouse/utils/warehouse-utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function CapacityCell({ capacity }: { capacity: Capacity }) {
  const occupancy = Math.min(
    100,
    Math.max(0, capacity.occupancy_percentage ?? 0),
  );

  return (
    <div className="flex w-[180px] flex-col gap-1.5">
      <div className="flex justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Total: {formatAreaM2(capacity.total_area_m2)}</span>
        <span>Libre: {formatAreaM2(capacity.free_area_m2)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full w-full origin-left rounded-full ${getOccupancyBarColor(occupancy)}`}
          style={{ transform: `scaleX(${occupancy / 100})` }}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Ocupación: {occupancy}%
      </span>
    </div>
  );
}

function WarehouseNameCell({ item }: { item: WarehouseTableRow }) {
  const isChild = item.depth > 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 min-w-0 ${
        isChild ? "text-slate-300" : ""
      }`}
      style={{ paddingLeft: isChild ? `${item.depth * 1.25}rem` : 0 }}
    >
      {isChild && (
        <CornerDownRight
          size={18}
          className="shrink-0 text-slate-400 dark:text-slate-500"
          aria-hidden
        />
      )}
      <span className="truncate">{item.warehouse_name || "—"}</span>
    </span>
  );
}

export function getWarehouseColumns({
  onViewSections,
  onAttachSubwarehouse,
  lastItemId,
}: WarehouseColumnsOptions): TableColumn<WarehouseTableRow>[] {
  return [
    {
      key: "warehouse_name",
      label: "Nombre",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} variant="text" />
        ) : (
          <WarehouseNameCell item={item} />
        ),
    },
    {
      key: "warehouse_code",
      label: "Código",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          item.warehouse_code || "—"
        ),
    },
    {
      key: "warehouse_type",
      label: "Tipo",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          getWarehouseTypeLabel(item.warehouse_type)
        ),
    },
    {
      key: "sections_count",
      label: "Secciones",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          item.sections_count
        ),
    },
    {
      key: "is_owner",
      label: "Propiedad",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} variant="badge" />
        ) : (
          <OwnerBadge isOwner={item.is_owner} />
        ),
    },
    {
      key: "capacity",
      label: "Capacidad",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} variant="capacity" />
        ) : (
          <CapacityCell capacity={item.capacity} />
        ),
    },
    {
      key: "usable_area_m2",
      label: "Área utilizable",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          formatAreaM2(item.capacity.usable_area_m2)
        ),
    },
    {
      key: "unusable_area_m2",
      label: "Área no utilizable",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          formatAreaM2(item.capacity.unusable_area_m2)
        ),
    },
    {
      key: "occupied_area_m2",
      label: "Área ocupada",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} />
        ) : (
          formatAreaM2(item.capacity.occupied_area_m2)
        ),
    },
    {
      key: "is_active",
      label: "Estado",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} variant="badge" />
        ) : (
          <ActiveStatusBadge isActive={item.is_active} />
        ),
    },
    {
      key: "action",
      label: "Acciones",
      render: (item) =>
        item.isSkeleton ? (
          <WarehouseTableSkeletonCell item={item} variant="action" />
        ) : (
          <ContextMenu
            items={[
              {
                label: "Ver secciones",
                onClick: () => onViewSections(item),
              },
              {
                label: "Anexar subwarehouse",
                onClick: () => onAttachSubwarehouse(item),
              },
            ]}
            triggerClassName={contextMenuButton}
            openUpOnMobile={item.warehouse_id === lastItemId}
          />
        ),
    },
  ];
}
