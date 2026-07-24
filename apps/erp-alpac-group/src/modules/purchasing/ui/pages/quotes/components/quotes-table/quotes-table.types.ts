import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";

export type QuotesTableProps = {
  data: GetHistoryQuotesView[];
  onViewDetail: (quote: GetHistoryQuotesView) => void;
};
