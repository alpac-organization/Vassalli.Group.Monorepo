import { Text, View } from "@react-pdf/renderer";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";

type QuoteAnalysisPdfSignaturesProps = {
	elaboratedBy: string;
};

export function QuoteAnalysisPdfSignatures({
	elaboratedBy,
}: QuoteAnalysisPdfSignaturesProps) {
	return (
		<View style={styles.signatures}>
			<View style={styles.signatureBlock}>
				<View style={styles.signatureLine} />
				<Text style={styles.signatureRole}>* Elaborado por:</Text>
				<Text style={styles.signatureName}>{elaboratedBy}</Text>
			</View>
			<View style={styles.signatureBlock}>
				<View style={styles.signatureLine} />
				<Text style={styles.signatureRole}>* Aprobado</Text>
			</View>
		</View>
	);
}
