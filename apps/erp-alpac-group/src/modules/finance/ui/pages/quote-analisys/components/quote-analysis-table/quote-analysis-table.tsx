import { useMemo } from "react";
import {
	Badges,
	DataTable,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";

export function QuoteAnalysisTable() {

	const columns = useMemo<TableColumn<any>[]>(() => {

		const supplierColumns: TableColumn<any>[] = []

		return [
			{
				key: "product_name",
				label: "Producto",
				render: (row) => (
					<div className="min-w-0">
						<p className="m-0 font-medium text-slate-900 dark:text-white">
							{row.product_name}
						</p>
						<p className="m-0 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
							Unidad: {row.unit_measure_id}
						</p>
					</div>
				),
			},
			...supplierColumns,
			{
				key: "best_option",
				label: "Mejor opción",
				render: (row) => {
					if (row.best_price == null || !row.best_supplier_key) return "—";
					

					return (
						<div className="flex flex-col gap-1">
							<span className="text-sm font-semibold text-slate-900 dark:text-white">
								Solo información
							</span>
							<Badges
								label="Proveedor"
								color="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
							/>
						</div>
					);
				},
			},
		];
	}, []);

	return (
		<DataTable
			title="Cuadro comparativo por producto"
			data={[]}
			columns={columns}
			pagination={
				<Pagination
					currentPage={1}
					pageSize={10}
					totalRecords={0}
					onPageChange={() => {}}
				/>
			}
		/>
	);
}
