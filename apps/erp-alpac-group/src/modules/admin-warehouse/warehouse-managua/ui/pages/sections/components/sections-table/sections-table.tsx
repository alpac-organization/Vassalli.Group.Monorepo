import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getSectionsColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-columns";
import type { SectionsTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-table.types";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export function SectionsTable({
	data,
	currentPage,
	totalRecords,
	pageSize,
	height,
	minHeight,
	maxHeight,
	isFetching = false,
	selectedSection,
	onPageChange,
	onViewLots,
	onViewRacks,
	onSelectRow,
	onUpdateSection,
	onDeleteSection,	
}: SectionsTableProps) {
	const lastItemId = data.at(-1)?.section_id;

	const columns = useMemo(
		() =>
			getSectionsColumns({
				onViewLots,
				onViewRacks,
				onUpdateSection,
				onDeleteSection,				
				lastItemId,
			}),
		[
			onViewLots, onViewRacks,
			onUpdateSection, onDeleteSection,			
			lastItemId
		],
	);

	const handleRowClick = (row: SectionDto) => {
		console.log("Revisando por que no me selecciona", row);
		onSelectRow(row);
	}

	return (
		<DataTable
			title="Lista de secciones"
			data={data}
			columns={columns}
			
			onRowClick={handleRowClick}
			selectedRowKey={selectedSection?.section_id}
			getRowKey={(row) => row.section_id}
			height={height}
			minHeight={minHeight}
			maxHeight={maxHeight}
			enableSelectBorder
			pagination={
				<Pagination
					currentPage={currentPage}
					pageSize={pageSize}
					totalRecords={totalRecords}
					onPageChange={onPageChange}
					disabled={isFetching || totalRecords === 0}
				/>
			}
		/>

	);
}
