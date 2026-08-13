import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";

export type QuoteAnalysisFiltersValues = {
  status: accountingReviewStatusType | "";
  area_id: string;
};

export type QuoteAnalysisFiltersProps = {
  onApply: (filters: QuoteAnalysisFiltersValues) => void;
  onClear: () => void;
};
