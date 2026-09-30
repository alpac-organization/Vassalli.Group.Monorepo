import { Image, Text, View } from "@react-pdf/renderer";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";

type QuoteAnalysisPdfHeaderProps = {
	companyLogoUrl?: string;
	dateLabel: string;
};

export function QuoteAnalysisPdfHeader({
	companyLogoUrl,
	dateLabel,
}: QuoteAnalysisPdfHeaderProps) {
	return (
		<View style={styles.headerRow}>
			<View style={styles.headerLeft}>
				{companyLogoUrl ? (
					<Image src={companyLogoUrl} style={styles.logo} />
				) : null}
			</View>
			<View style={styles.headerCenter}>
				<Text style={styles.documentTitle}>
					CUADRO DE ANÁLISIS COMPARATIVO
				</Text>
				<Text style={styles.dateLine}>1. Fecha de elaboración: {dateLabel}</Text>
			</View>
			<View style={styles.headerRight} />
		</View>
	);
}
