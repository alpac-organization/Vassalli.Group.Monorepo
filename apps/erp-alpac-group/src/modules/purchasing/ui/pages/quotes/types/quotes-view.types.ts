import type {
  GetHistoryQuotes,
  ProductDetailsQuotes,
  Quotes,
} from "@app/modules/purchasing/domain/quotes/responses/get-quotes";

export type ProductDetailsQuoteView = ProductDetailsQuotes & {
  product_id?: string;
};

export type QuoteSupplierView = Omit<Quotes, "product_details_quotes"> & {
  product_details_quotes: ProductDetailsQuoteView[];
};

export type GetHistoryQuotesView = Omit<
  GetHistoryQuotes,
  "additional_data"
> & {
  id: string;
  currency?: "NIO" | "USD";
  additional_data: {
    quotes_made: QuoteSupplierView[];
  };
};
