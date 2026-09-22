import { Document, Page } from "@react-pdf/renderer";
import { formatDate } from "@app/shared/utils/string.utils";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";
import {
	buildQuoteAnalysisPdfViewModel,
	getProviderBlockWidth,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/utils/quote-analysis.utils";
import type { QuoteAnalysisPDFProps } from "@app/modules/finance/ui/pages/quote-analisys/templates/types/quote-analysis.types";
import { QuoteAnalysisPdfHeader } from "@app/modules/finance/ui/pages/quote-analisys/templates/components/quote-analysis-pdf-header";
import { QuoteAnalysisPdfItemsTable } from "@app/modules/finance/ui/pages/quote-analisys/templates/components/quote-analysis-pdf-items-table";
import { QuoteAnalysisPdfQualitativeTable } from "@app/modules/finance/ui/pages/quote-analisys/templates/components/quote-analysis-pdf-qualitative-table";
import { QuoteAnalysisPdfClosingBlock } from "@app/modules/finance/ui/pages/quote-analisys/templates/components/quote-analysis-pdf-closing-block";
import { QuoteAnalysisPdfSignatures } from "@app/modules/finance/ui/pages/quote-analisys/templates/components/quote-analysis-pdf-signatures";

export function QuoteAnalysisPDF({
	detail,
	products,
	companyLogoUrl,
	elaborationDate,
}: QuoteAnalysisPDFProps) {
	const viewModel = buildQuoteAnalysisPdfViewModel(detail, products);
	const { suppliers, items, totals, qualitative } = viewModel;
	const providerWidth = getProviderBlockWidth(suppliers.length);
	const dateLabel = formatDate(
		elaborationDate || detail.sent_to_review_at || new Date().toISOString(),
	);

	return (
		<Document>
			<Page size="LETTER" orientation="landscape" style={styles.page}>
				<QuoteAnalysisPdfHeader
					companyLogoUrl={companyLogoUrl}
					dateLabel={dateLabel}
				/>

				<QuoteAnalysisPdfItemsTable
					suppliers={suppliers}
					items={items}
					totals={totals}
					providerWidth={providerWidth}
				/>

				<QuoteAnalysisPdfQualitativeTable
					suppliers={suppliers}
					qualitative={qualitative}
				/>

				<QuoteAnalysisPdfClosingBlock
					selectedSupplierNames={viewModel.selectedSupplierNames}
					justification={viewModel.justification}
				/>

				<QuoteAnalysisPdfSignatures elaboratedBy={viewModel.elaboratedBy} />
			</Page>
		</Document>
	);
}
