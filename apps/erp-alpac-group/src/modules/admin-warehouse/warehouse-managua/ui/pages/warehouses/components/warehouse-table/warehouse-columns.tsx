import { ContextMenu, type TableColumn } from "@alpac/design-system";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import type { WarehouseColumnsOptions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/types/warehouse-table.types";
import { ActiveStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/badges/active-status-badge";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function getWarehouseColumns({
	onViewSections,
	onViewDetails,
	lastItemId
}: WarehouseColumnsOptions): TableColumn<WarehouseDto>[] {
	return [
		{
			key: "code",
			label: "Código",
			render: (item: WarehouseDto) => item.code || "—",
		},
		{
			key: "warehouse_type",
			label: "Tipo",
			render: (item: WarehouseDto) => getWarehouseTypeLabel(item.warehouse_type),
		},
		{
			key: "is_active",
			label: "Estado",
			render: (item: WarehouseDto) => <ActiveStatusBadge isActive={item.is_active} />,
		},
		{
			key: "action",
			label: "Acciones",
			render: (item: WarehouseDto) => (
				<ContextMenu
					items={[
						{
							label: "Ver secciones",
							onClick: () => onViewSections(item),
						},
						{
							label: "Ver detalles",
							onClick: () => onViewDetails(item),
						},
					]}
					triggerClassName={contextMenuButton}
					openUpOnMobile={item.warehouse_id === lastItemId}
				/>
			),
		},
	];
}
