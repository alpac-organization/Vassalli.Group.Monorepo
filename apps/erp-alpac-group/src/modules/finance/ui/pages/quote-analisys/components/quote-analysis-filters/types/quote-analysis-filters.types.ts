import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";

export type QuoteAnalysisFiltersProps = {
  onApply: (status: accountingReviewStatusType) => void;
  onClear: () => void;
};
