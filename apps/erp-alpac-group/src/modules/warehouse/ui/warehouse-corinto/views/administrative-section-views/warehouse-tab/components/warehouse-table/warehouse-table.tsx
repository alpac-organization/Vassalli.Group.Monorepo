import { Button, DataTable, Pagination, type TableColumn } from "@alpac/design-system";
import { useMemo } from "react";
import type { WarehouseTableProps } from "./warehouse-table.types";

const mockWarehouses = [
	{
		warehouse_name: "Bodega Corinto 1",
		code: "COR-01",
		warehouse_type: "General",
		total_area: 2500,
		net_storage_area: 2200,
		is_active: true,
	},
];

export const WarehouseTable = ({ data }: WarehouseTableProps) => {
	const columnConfig: TableColumn<(typeof mockWarehouses)[number]>[] = [
		{ key: "warehouse_name", label: "Nombre" },
		{ key: "code", label: "Código" },
		{ key: "warehouse_type", label: "Tipo" },
		{ key: "total_area", label: "Área total" },
		{ key: "net_storage_area", label: "Área neta" },
		{
			key: "is_active",
			label: "Estado",
			render(row) {
				return row.is_active ? "Activa" : "Inactiva";
			},
		},
		{
			key: "action",
			label: "Acciones",
			render(row) {
				return (
					<Button
						type="button"
						size="medium"
						label="Ver detalle"
						onClick={() => {
							console.log(row);
						}}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
					
				);
			},
		},
	];

	const testingData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.length ? data : mockWarehouses;
	}, [data]);

	return (
		<>
			<DataTable
				title="Lista de bodegas"
				data={testingData}
				columns={columnConfig}
				pagination={
					<Pagination
						currentPage={0}
						pageSize={0}
						totalRecords={0}
						onPageChange={() => {}}
						disabled={false}
					/>
				}
			/>
		</>
	);
};
