import type { GetHistoryQuotes } from "@app/modules/procurement/domain/quotes/responses/get-quotes";

export interface IQuotesServices {
  createQuote: (quote: unknown) => Promise<void>;
  getHistoryQuotesByDate: () => Promise<GetHistoryQuotes[]>;
}
