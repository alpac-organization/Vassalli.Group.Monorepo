import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";

export type QuoteAnalysisFiltersValues = {
  status: accountingReviewStatusType | "";
  area_id: string;
};

export type QuoteAnalysisFiltersProps = {
  onApply: (filters: QuoteAnalysisFiltersValues) => void;
  onClear: () => void;
};
