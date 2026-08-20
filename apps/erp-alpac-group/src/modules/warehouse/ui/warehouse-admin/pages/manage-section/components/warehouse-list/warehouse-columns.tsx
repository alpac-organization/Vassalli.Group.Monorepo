import { ContextMenu, type TableColumn } from "@alpac/design-system";
import { ActiveStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export type WarehouseRow = {
	warehouse_id: string;
	warehouse_name: string;
	warehouse_code: string;
	warehouse_type: string;
	is_active: boolean;
};

interface GetWarehouseColumnsProps {
	onViewSections: (warehouseId: string) => void;
	lastItemId?: string;
}

export function getWarehouseColumns({ onViewSections, lastItemId }: GetWarehouseColumnsProps): TableColumn<WarehouseRow>[] {
	return [
		{ key: "warehouse_name", label: "Nombre" },
		{ key: "warehouse_code", label: "Código" },
		{ key: "warehouse_type", label: "Tipo" },
		{
			key: "is_active",
			label: "Estado",
			render(row) {
				return <ActiveStatusBadge isActive={row.is_active} />;
			},
		},
		{
			key: "action",
			label: "Acciones",
			render(row) {
				const isLastItem = row.warehouse_id === lastItemId;

				return (
					<ContextMenu
						items={[
							{
								label: "Ver secciones",
								onClick: () => onViewSections(row.warehouse_id),
							},
							{
								label: "Anexar tipo de bodega",
								onClick: () => onViewSections(row.warehouse_id),
							},
						]}
						triggerClassName={contextMenuButton}
						openUpOnMobile={isLastItem}
					/>
				);
			},
		},
	];
}
