import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";

export type CreateQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quote: GetHistoryQuotesView) => void;
};
