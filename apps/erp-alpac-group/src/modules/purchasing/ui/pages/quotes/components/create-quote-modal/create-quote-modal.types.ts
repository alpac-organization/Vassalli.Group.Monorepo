import type { GetHistoryQuotesView } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-view.types";

export type CreateQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quote: GetHistoryQuotesView) => void;
};
