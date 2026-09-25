import { Text, View } from "@react-pdf/renderer";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";
import {
	EMPTY_CELL,
	QUALITATIVE_LABEL_WIDTH,
	QUALITATIVE_PROVIDERS_WIDTH,
	QUALITATIVE_ROWS,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/constants/quote-analysis-report";
import {
	getProviderHeaderColor,
	getQualitativeProviderWidth,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/utils/quote-analysis.utils";
import type {
	QuoteAnalysisPdfQualitative,
	QuoteAnalysisPdfSupplier,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";

type QuoteAnalysisPdfQualitativeTableProps = {
	suppliers: QuoteAnalysisPdfSupplier[];
	qualitative: QuoteAnalysisPdfQualitative;
	colorIndexOffset?: number;
	providerLabelOffset?: number;
};

export function QuoteAnalysisPdfQualitativeTable({
	suppliers,
	qualitative,
	colorIndexOffset = 0,
	providerLabelOffset = 0,
}: QuoteAnalysisPdfQualitativeTableProps) {
	const hasSuppliers = suppliers.length > 0;
	const providerWidth = getQualitativeProviderWidth(suppliers.length);
	const lastSupplierIndex = suppliers.length - 1;

	return (
		<View style={[styles.table, styles.sectionGap]}>
			<View style={styles.row}>
				<View style={[styles.cell, { width: QUALITATIVE_LABEL_WIDTH }]}>
					<Text style={styles.qualLabel}>Criterio</Text>
				</View>
				{suppliers.map((supplier, index) => (
					<View
						key={`qhdr-${supplier.supplierId}`}
						style={[
							styles.cell,
							{
								width: providerWidth,
								backgroundColor: getProviderHeaderColor(
									index + colorIndexOffset,
								),
							},
							index === lastSupplierIndex ? styles.cellLast : {},
						]}
					>
						<Text style={styles.qualHeader}>
							Proveedor {index + providerLabelOffset + 1}
						</Text>
					</View>
				))}
				{!hasSuppliers ? (
					<View
						style={[
							styles.cell,
							styles.cellLast,
							{
								width: QUALITATIVE_PROVIDERS_WIDTH,
								backgroundColor: getProviderHeaderColor(colorIndexOffset),
							},
						]}
					>
						<Text style={styles.qualHeader}>Proveedores</Text>
					</View>
				) : null}
			</View>

			{QUALITATIVE_ROWS.map((row, rowIndex) => (
				<View
					key={row.key}
					style={[
						styles.row,
						rowIndex === QUALITATIVE_ROWS.length - 1 ? styles.rowLast : {},
					]}
				>
					<View style={[styles.cell, { width: QUALITATIVE_LABEL_WIDTH }]}>
						<Text style={styles.qualLabel}>{row.label}</Text>
					</View>
					{suppliers.map((supplier, index) => (
						<View
							key={`${row.key}-${supplier.supplierId}`}
							style={[
								styles.cell,
								{ width: providerWidth },
								index === lastSupplierIndex ? styles.cellLast : {},
							]}
						>
							<Text style={[styles.bodyText, styles.cellCenter]}>
								{qualitative[row.key][supplier.supplierId] ?? EMPTY_CELL}
							</Text>
						</View>
					))}
				</View>
			))}
		</View>
	);
}
