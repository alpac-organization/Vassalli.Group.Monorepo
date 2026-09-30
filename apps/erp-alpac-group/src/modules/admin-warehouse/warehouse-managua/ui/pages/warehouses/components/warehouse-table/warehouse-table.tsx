import { useMemo } from "react";
import { DataTable, Pagination } from "@alpac/design-system";
import type { WarehouseTableProps } from "./types/warehouse-table.types";
import { getWarehouseColumns } from "./warehouse-columns";

export function WarehouseTable({
	data,
	currentPage,
	totalRecords,
	pageSize,
	onPageChange,
	onViewSections,
	onViewDetails,
	isFetching = false,
}: WarehouseTableProps) {

	const lastItemId = data.at(-1)?.warehouse_id;

	const columnConfig = useMemo(
		() => getWarehouseColumns({ onViewSections, onViewDetails, lastItemId }),
		[onViewSections, lastItemId],
	);

	return (
		<div className="flex flex-col min-w-0 w-full overflow-x-auto">
			<DataTable
				title="Lista de bodegas"
				data={data ?? []}
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
