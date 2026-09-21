import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getSectionsColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-columns";
import type { SectionsTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/types/sections-table.types";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";

export function SectionsTable({
	data,
	currentPage,
	totalRecords,
	pageSize,
	onPageChange,
	onViewLots,
	onViewRacks,
	isFetching = false,
}: SectionsTableProps) {

	const lastItemId = data.at(-1)?.section_id;
	
	const columns = useMemo(
		() => getSectionsColumns({ onViewLots, onViewRacks, lastItemId }),
		[onViewLots, onViewRacks, lastItemId],
	);

	const MOCK_SECTION_ID = "03e43b1f-e13c-44b4-a0f4-504aa9d3c386";

	const mockedData: SectionResponse[] = [
		{ section_id: MOCK_SECTION_ID, section_name: "Bodega 1", section_code: "W001", is_active: true, section_type: "001", storage_type: "Lots" },
		{ section_id: "W002", section_name: "Bodega 2", section_code: "W002", is_active: true, section_type: "002", storage_type: "Lots" },
	];

	return (
		<div className="flex flex-col min-w-0 w-full overflow-x-auto">
			<DataTable
				title="Lista de secciones"
				data={mockedData}
				columns={columns}
				pagination={
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalRecords={totalRecords}
						onPageChange={onPageChange}
						disabled={isFetching}
					/>
				}
			/>
		</div>
	);
}
