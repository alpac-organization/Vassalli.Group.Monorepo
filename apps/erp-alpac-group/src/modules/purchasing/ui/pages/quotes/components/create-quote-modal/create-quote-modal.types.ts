export type CreateQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quote: any) => void;
};
