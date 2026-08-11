import type { RegisterQuotationRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";

export interface IQuotesServices {

  RegisterQuote: (payload: RegisterQuotationRequest) => Promise<void>;

  UpdateQuote: (payload: any) => Promise<void>;
}
