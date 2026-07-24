import type { GetHistoryQuotesView } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-view.types";

export type QuoteDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: GetHistoryQuotesView | null;
};
