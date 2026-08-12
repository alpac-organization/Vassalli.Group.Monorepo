import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { UpdateQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/update-quote-request";
import { QuoteServices } from "@app/modules/purchasing/infrastructure/services/quote/QuoteServices"
import { useMutation } from "@tanstack/react-query";

const quoteServices = new QuoteServices(warehouseHttpHandler);

export const useQuotes = () => {

   const RegisterQuote = useMutation<void, ApiErrorResponse, RegisterQuoteRequest>({
      mutationKey: ["register-quote"],
      mutationFn: (payload: RegisterQuoteRequest) => quoteServices.RegisterQuote(payload),
      retry: 1
   });

   const UpdateQuote = useMutation<void, ApiErrorResponse, UpdateQuoteRequest>({
      mutationKey: ["update-quote"],
      mutationFn: (payload: UpdateQuoteRequest) => quoteServices.UpdateQuote(payload),
      retry: 1
   });

   return { RegisterQuote, UpdateQuote }
}