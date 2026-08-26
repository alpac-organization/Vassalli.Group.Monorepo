import type { RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { UpdateQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/update-quote-request";

export interface IQuotesServices {

  RegisterQuote(payload: RegisterQuoteRequest): Promise<void>;

  UpdateQuote(payload: UpdateQuoteRequest): Promise<void>;
}
