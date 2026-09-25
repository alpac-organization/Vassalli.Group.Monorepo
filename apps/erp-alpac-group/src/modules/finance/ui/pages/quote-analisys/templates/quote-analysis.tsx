import { Document, Page } from "@react-pdf/renderer";
import { formatDate } from "@app/shared/utils/string.utils";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";
import {
	buildQuoteAnalysisPdfViewModel,
	chunkSuppliers,
	getProviderBlockWidth,
	SUPPLIERS_PER_PAGE_CHUNK,
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
	const supplierChunks = chunkSuppliers(suppliers, SUPPLIERS_PER_PAGE_CHUNK);
	const lastChunkIndex = supplierChunks.length - 1;
	const dateLabel = formatDate(
		elaborationDate || detail.sent_to_review_at || new Date().toISOString(),
	);

	return (
		<Document>
			{supplierChunks.map((chunk, chunkIndex) => {
				const colorIndexOffset = chunkIndex * SUPPLIERS_PER_PAGE_CHUNK;
				const providerWidth = getProviderBlockWidth(chunk.length);
				const isLastChunk = chunkIndex === lastChunkIndex;

				return (
					<Page
						key={`supplier-chunk-${chunkIndex}`}
						size="LETTER"
						orientation="landscape"
						style={styles.page}
					>
						<QuoteAnalysisPdfHeader
							companyLogoUrl={companyLogoUrl}
							dateLabel={dateLabel}
						/>

						<QuoteAnalysisPdfItemsTable
							suppliers={chunk}
							items={items}
							totals={totals}
							providerWidth={providerWidth}
							colorIndexOffset={colorIndexOffset}
						/>

						<QuoteAnalysisPdfQualitativeTable
							suppliers={chunk}
							qualitative={qualitative}
							colorIndexOffset={colorIndexOffset}
							providerLabelOffset={colorIndexOffset}
						/>

						{isLastChunk ? (
							<>
								<QuoteAnalysisPdfClosingBlock
									selectedSupplierNames={viewModel.selectedSupplierNames}
									justification={viewModel.justification}
								/>

								<QuoteAnalysisPdfSignatures
									elaboratedBy={viewModel.elaboratedBy}
								/>
							</>
						) : null}
					</Page>
				);
			})}
		</Document>
	);
}
