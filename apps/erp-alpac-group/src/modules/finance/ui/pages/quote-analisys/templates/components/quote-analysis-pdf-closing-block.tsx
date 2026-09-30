import { Text, View } from "@react-pdf/renderer";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";

type QuoteAnalysisPdfClosingBlockProps = {
	selectedSupplierNames: string;
	justification: string;
};

export function QuoteAnalysisPdfClosingBlock({
	selectedSupplierNames,
	justification,
}: QuoteAnalysisPdfClosingBlockProps) {
	return (
		<View style={styles.closingBlock}>
			<View style={styles.closingRow}>
				<Text style={styles.closingLabel}>* Sugerencia del técnico:</Text>
				<Text style={styles.closingValue}>N/A</Text>
			</View>
			<View style={styles.closingRow}>
				<Text style={styles.closingLabel}>* Sugerencia del Administrador:</Text>
				<Text style={styles.closingValue}>N/A</Text>
			</View>
			<View style={styles.closingRow}>
				<Text style={styles.closingLabel}>* Proveedor seleccionado:</Text>
				<Text style={styles.closingValue}>{selectedSupplierNames}</Text>
			</View>
			<View style={[styles.closingRow, styles.closingRowLast]}>
				<Text style={styles.closingLabel}>* Justificación:</Text>
				<Text style={styles.closingValue}>{justification}</Text>
			</View>
		</View>
	);
}
