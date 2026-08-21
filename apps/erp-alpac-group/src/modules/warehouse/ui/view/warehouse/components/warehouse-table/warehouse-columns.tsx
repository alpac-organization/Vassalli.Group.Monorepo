import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import { CornerDownRight } from "lucide-react";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/types/warehouse-table.types";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type WarehouseColumnsOptions = {
  onViewSections: (warehouse: WarehouseDto) => void;
  onAttachSubwarehouse: (warehouse: WarehouseDto) => void;
  lastItemId?: string;
};

function ActiveStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badges
      label="Activa"
      color="success"
      className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
    />
  ) : (
    <Badges
      label="Inactiva"
      color="gray"
      className="bg-slate-800! border! border-slate-700! text-slate-400!"
    />
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
      render: (item) => <WarehouseNameCell item={item} />,
    },
    {
      key: "warehouse_code",
      label: "Código",
      render: (item) => item.warehouse_code || "—",
    },
    {
      key: "warehouse_type",
      label: "Tipo",
      render: (item) => getWarehouseTypeLabel(item.warehouse_type),
    },
    {
      key: "is_active",
      label: "Estado",
      render: (item) => <ActiveStatusBadge isActive={item.is_active} />,
    },
    {
      key: "action",
      label: "Acciones",
      render: (item) => (
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
