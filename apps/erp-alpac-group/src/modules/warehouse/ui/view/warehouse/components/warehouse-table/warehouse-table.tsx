import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getWarehouseColumns } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/warehouse-columns";
import type { WarehouseTableProps } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/types/warehouse-table.types";
import type { WarehouseTableRow } from "./utils/skeleton-table";

export function WarehouseTable({
	data,
	currentPage,
	totalRecords,
	pageSize,
	onPageChange,
	onViewSections,
	onAttachSubwarehouse,
	isFetching = false,
}: WarehouseTableProps) {
	const lastItemId = data.at(-1)?.warehouse_id;
	const columnConfig = useMemo(
		() => getWarehouseColumns({ onViewSections, onAttachSubwarehouse, lastItemId }),
		[onViewSections, onAttachSubwarehouse, lastItemId],
	);

	const mockedData: WarehouseTableRow[] = [
		{ warehouse_id: "26b3b943-01ec-4a51-8fdd-f10fdde09159", warehouse_name: "Bodega 1", warehouse_code: "W001", is_active: true, branch_code: "001", warehouse_type: "Tipo A", has_children: false, sections_count: 5, is_owner: true, capacity: { total_area_m2: 100, free_area_m2: 50, last_calculated_at: '', occupancy_percentage: 50, occupied_area_m2: 50, unusable_area_m2: 0, usable_area_m2: 50 }, depth: 0, isSkeleton: false },
		{ warehouse_id: "1569ef48-15a7-4f5d-9788-0ffd3d7b6dd3", warehouse_name: "Bodega 2", warehouse_code: "W002", is_active: true, branch_code: "002", warehouse_type: "Tipo B", has_children: false, sections_count: 3, is_owner: false, capacity: { total_area_m2: 80, free_area_m2: 30, last_calculated_at: '', occupancy_percentage: 62.5, occupied_area_m2: 50, unusable_area_m2: 0, usable_area_m2: 30 }, depth: 0, isSkeleton: false }
	];

	return (
		<div className="flex flex-col min-w-0 w-full overflow-x-auto">
			<DataTable
				title="Lista de bodegas"
				data={mockedData}
				columns={columnConfig}
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
