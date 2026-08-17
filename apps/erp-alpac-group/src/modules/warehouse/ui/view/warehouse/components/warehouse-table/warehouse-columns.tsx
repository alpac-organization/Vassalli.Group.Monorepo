import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type WarehouseColumnsOptions = {
  onViewSections: (warehouse: GetWarehousesResponse) => void;
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

export function getWarehouseColumns({
  onViewSections,
  lastItemId,
}: WarehouseColumnsOptions): TableColumn<GetWarehousesResponse>[] {
  return [
    {
      key: "warehouse_name",
      label: "Nombre",
      render: (item) => item.warehouse_name || "—",
    },
    {
      key: "warehouse_code",
      label: "Código",
      render: (item) => item.warehouse_code || "—",
    },
    {
      key: "warehouse_type",
      label: "Tipo",
      render: (item) => item.warehouse_type || "—",
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
          ]}
          triggerClassName={contextMenuButton}
          openUpOnMobile={item.warehouse_id === lastItemId}
        />
      ),
    },
  ];
}
