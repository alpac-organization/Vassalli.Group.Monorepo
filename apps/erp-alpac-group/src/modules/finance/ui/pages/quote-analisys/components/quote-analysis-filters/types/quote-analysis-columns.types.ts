import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis"

export type QuoteAnalysisColumns = {
   onViewDetail?: (row: RequisitionAccountingReviewDto) => void,
   onSendToReview?: (row: RequisitionAccountingReviewDto) => void
}