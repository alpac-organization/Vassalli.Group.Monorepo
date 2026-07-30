import type { QuoteDetails } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/types/create-quote-form.types";

export interface IQuotesServices {

  CreateQuote: (payload: QuoteDetails) => Promise<void>;  
}
