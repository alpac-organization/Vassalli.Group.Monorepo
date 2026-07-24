import { useMemo } from "react";
import {
	Badges,
	DataTable,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type {
	QuoteComparisonRow,
	QuoteSupplierColumn,
} from "@app/modules/purchasing/ui/pages/quote-analisys/quote-analisys.utils";

type QuoteAnalysisTableProps = {
	rows: QuoteComparisonRow[];
	suppliers: QuoteSupplierColumn[];
	currency?: "NIO" | "USD";
};

export function QuoteAnalysisTable({
	rows,
	suppliers,
	currency = "NIO",
}: QuoteAnalysisTableProps) {
	const columns = useMemo<TableColumn<QuoteComparisonRow>[]>(() => {
		const supplierColumns: TableColumn<QuoteComparisonRow>[] = suppliers.map(
			(supplier) => ({
				key: supplier.key,
				label: supplier.label,
				render: (row) => {
					const price = row.prices_by_supplier[supplier.key];
					const isBest =
						row.best_supplier_key === supplier.key && price != null;

					if (price == null) {
						return (
							<span className="text-slate-400 dark:text-slate-500">—</span>
						);
					}

					return (
						<span
							className={
								isBest
									? "font-semibold text-emerald-700 dark:text-emerald-300"
									: "text-slate-800 dark:text-slate-200"
							}
						>
							{formatCurrency(price, currency) ?? "—"}
						</span>
					);
				},
			}),
		);

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
					if (row.best_price == null || !row.best_supplier_key) {
						return "—";
					}

					const bestSupplier = suppliers.find(
						(supplier) => supplier.key === row.best_supplier_key,
					);

					return (
						<div className="flex flex-col gap-1">
							<span className="text-sm font-semibold text-slate-900 dark:text-white">
								{formatCurrency(row.best_price, currency) ?? "—"}
							</span>
							<Badges
								label={bestSupplier?.label ?? "Proveedor"}
								color="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
							/>
						</div>
					);
				},
			},
		];
	}, [currency, suppliers]);

	return (
		<DataTable
			title="Cuadro comparativo por producto"
			data={rows}
			columns={columns}
			pagination={
				<Pagination
					currentPage={1}
					pageSize={10}
					totalRecords={rows.length}
					onPageChange={() => {}}
				/>
			}
		/>
	);
}
