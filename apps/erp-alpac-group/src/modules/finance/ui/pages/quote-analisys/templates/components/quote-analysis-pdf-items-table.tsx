import { Text, View } from "@react-pdf/renderer";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";
import {
	EMPTY_CELL,
	FIXED_COLUMNS_TOTAL_WIDTH,
	FIXED_WIDTH,
	PROVIDER_SUB_HEADERS,
	PROVIDERS_GROUP_HEADER_COLOR,
	PROVIDERS_TOTAL_WIDTH,
	SUB_COL_COUNT,
	SUB_COL_WIDTH,
	TOTALS_ROWS,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/constants/quote-analysis-report";
import { getProviderHeaderColor } from "@app/modules/finance/ui/pages/quote-analisys/templates/utils/quote-analysis.utils";
import type {
	QuoteAnalysisPdfItemRow,
	QuoteAnalysisPdfSupplier,
	QuoteAnalysisPdfTotals,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";

type QuoteAnalysisPdfItemsTableProps = {
	suppliers: QuoteAnalysisPdfSupplier[];
	items: QuoteAnalysisPdfItemRow[];
	totals: QuoteAnalysisPdfTotals;
	providerWidth: string;
};

function FixedColumnPlaceholders() {
	return (
		<>
			<View style={[styles.cell, { width: FIXED_WIDTH.qty }]} />
			<View style={[styles.cell, { width: FIXED_WIDTH.um }]} />
			<View style={[styles.cell, { width: FIXED_WIDTH.desc }]} />
		</>
	);
}

function SubColumns({
	values,
	boldLast,
}: {
	values: readonly string[];
	boldLast?: boolean;
}) {
	return (
		<>
			{values.map((value, subIndex) => (
				<View
					key={subIndex}
					style={{
						width: SUB_COL_WIDTH,
						borderRightWidth: subIndex === SUB_COL_COUNT - 1 ? 0 : 1,
						borderRightColor: "#000",
						paddingVertical: 2,
						paddingHorizontal: 1,
						justifyContent: "center",
					}}
				>
					<Text
						style={[
							styles.bodyText,
							styles.cellCenter,
							boldLast && subIndex === SUB_COL_COUNT - 1 ? styles.cellBold : {},
						]}
					>
						{value}
					</Text>
				</View>
			))}
		</>
	);
}

export function QuoteAnalysisPdfItemsTable({
	suppliers,
	items,
	totals,
	providerWidth,
}: QuoteAnalysisPdfItemsTableProps) {
	const hasSuppliers = suppliers.length > 0;
	const lastSupplierIndex = suppliers.length - 1;

	return (
		<View style={styles.table}>
			<View style={styles.row}>
				<View style={[styles.cell, { width: FIXED_WIDTH.qty }]}>
					<Text style={styles.headerCell}>Cantidad</Text>
				</View>
				<View style={[styles.cell, { width: FIXED_WIDTH.um }]}>
					<Text style={styles.headerCell}>UM</Text>
				</View>
				<View style={[styles.cell, { width: FIXED_WIDTH.desc }]}>
					<Text style={styles.headerCell}>Descripción</Text>
				</View>
				<View
					style={[
						styles.cell,
						styles.cellLast,
						{
							width: PROVIDERS_TOTAL_WIDTH,
							backgroundColor: PROVIDERS_GROUP_HEADER_COLOR,
						},
					]}
				>
					<Text style={styles.headerCell}>Proveedores</Text>
				</View>
			</View>

			{hasSuppliers ? (
				<View style={styles.row}>
					<FixedColumnPlaceholders />
					{suppliers.map((supplier, index) => (
						<View
							key={`hdr-${supplier.supplierId}`}
							style={[
								styles.cell,
								{
									width: providerWidth,
									backgroundColor: getProviderHeaderColor(index),
								},
								index === lastSupplierIndex ? styles.cellLast : {},
							]}
						>
							<Text style={styles.headerCell}>{supplier.name}</Text>
						</View>
					))}
				</View>
			) : null}

			{hasSuppliers ? (
				<View style={styles.row}>
					<FixedColumnPlaceholders />
					{suppliers.map((supplier, index) => (
						<View
							key={`subhdr-${supplier.supplierId}`}
							style={[
								styles.cell,
								{ width: providerWidth, flexDirection: "row", padding: 0 },
								index === lastSupplierIndex ? styles.cellLast : {},
							]}
						>
							{PROVIDER_SUB_HEADERS.map((label, subIndex) => (
								<View
									key={`${supplier.supplierId}-${label}`}
									style={{
										width: SUB_COL_WIDTH,
										borderRightWidth: subIndex === SUB_COL_COUNT - 1 ? 0 : 1,
										borderRightColor: "#000",
										paddingVertical: 2,
										justifyContent: "center",
									}}
								>
									<Text style={styles.subHeaderCell}>{label}</Text>
								</View>
							))}
						</View>
					))}
				</View>
			) : null}

			{items.map((item, itemIndex) => (
				<View
					key={`item-${itemIndex}`}
					style={[
						styles.row,
						itemIndex === items.length - 1 && !hasSuppliers ? styles.rowLast : {},
					]}
				>
					<View style={[styles.cell, { width: FIXED_WIDTH.qty }]}>
						<Text style={[styles.bodyText, styles.cellCenter]}>
							{item.quantity}
						</Text>
					</View>
					<View style={[styles.cell, { width: FIXED_WIDTH.um }]}>
						<Text style={[styles.bodyText, styles.cellCenter]}>
							{item.unitMeasure}
						</Text>
					</View>
					<View style={[styles.cell, { width: FIXED_WIDTH.desc }]}>
						<Text style={styles.bodyText}>{item.description}</Text>
					</View>
					{suppliers.map((supplier, index) => {
						const cell = item.cellsBySupplierId[supplier.supplierId];
						return (
							<View
								key={`${itemIndex}-${supplier.supplierId}`}
								style={[
									styles.cell,
									{ width: providerWidth, flexDirection: "row", padding: 0 },
									index === lastSupplierIndex ? styles.cellLast : {},
								]}
							>
								<SubColumns
									values={[
										cell?.brand ?? EMPTY_CELL,
										cell?.unitPrice ?? EMPTY_CELL,
										cell?.iva ?? EMPTY_CELL,
										cell?.total ?? EMPTY_CELL,
									]}
								/>
							</View>
						);
					})}
				</View>
			))}

			{TOTALS_ROWS.map((row, rowIndex) => (
				<View
					key={row.key}
					style={[
						styles.row,
						rowIndex === TOTALS_ROWS.length - 1 ? styles.rowLast : {},
					]}
				>
					<View
						style={[
							styles.cell,
							{
								width: FIXED_COLUMNS_TOTAL_WIDTH,
								flexDirection: "row",
								justifyContent: "flex-end",
							},
						]}
					>
						<Text style={styles.totalsLabel}>{row.label}</Text>
					</View>
					{suppliers.map((supplier, index) => {
						const amount = formatCurrency(
							totals[row.key][supplier.supplierId] ?? 0,
							"NIO",
						);
						const values = ["", "", "", amount] as const;
						return (
							<View
								key={`${row.key}-${supplier.supplierId}`}
								style={[
									styles.cell,
									{ width: providerWidth, flexDirection: "row", padding: 0 },
									index === lastSupplierIndex ? styles.cellLast : {},
								]}
							>
								<SubColumns values={values} boldLast={row.key === "total"} />
							</View>
						);
					})}
					{!hasSuppliers ? (
						<View
							style={[styles.cell, styles.cellLast, { width: PROVIDERS_TOTAL_WIDTH }]}
						>
							<Text style={styles.bodyText}>{EMPTY_CELL}</Text>
						</View>
					) : null}
				</View>
			))}
		</View>
	);
}
