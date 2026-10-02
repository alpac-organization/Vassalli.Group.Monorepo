import { useMemo } from "react";
import { DataTable, Pagination } from "@alpac/design-system";
import type { WarehouseTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/types/warehouse-table.types";
import { getWarehouseColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/warehouse-columns";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export function WarehouseTable({
	data,
	currentPage,
	totalRecords,
	pageSize,
	onPageChange,
	onViewSections,
	onViewDetails,
	onUpdateWarehouse,
	onSelectRow,
	selectedWarehouse,
	isFetching = false,
}: WarehouseTableProps) {
	const lastItemId = data.at(-1)?.warehouse_id;

	const columnConfig = useMemo(
		() =>
			getWarehouseColumns({
				onViewSections,
				onViewDetails,
				onUpdateWarehouse,
				lastItemId,
			}),
		[onViewSections, onViewDetails, onUpdateWarehouse, lastItemId],
	);

	const handleRowClick = (row: WarehouseDto) => {
		onSelectRow(row);
	};

	return (
		<div className="flex flex-col min-w-0 w-full overflow-x-auto">
			<DataTable
				title="Lista de bodegas"
				data={data ?? []}
				columns={columnConfig}
				onRowClick={handleRowClick}
				selectedRowKey={selectedWarehouse?.warehouse_id}
				getRowKey={(row) => row.warehouse_id}
				enableSelectBorder
				pagination={
					<Pagination
						currentPage={currentPage}
						totalRecords={totalRecords}
						pageSize={pageSize}
						onPageChange={onPageChange}
						disabled={isFetching || totalRecords === 0}
					/>
				}
			/>
		</div>
	);
}
