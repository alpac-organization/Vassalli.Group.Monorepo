import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { AcceptQuotationForPurchaseRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/accept-quotation-request";
import type { RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { UpdateQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/update-quote-request";
import { QuoteServices } from "@app/modules/purchasing/infrastructure/services/quote/QuoteServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const quoteServices = new QuoteServices(warehouseHttpHandler);

export const useQuotes = () => {
	const queryClient = useQueryClient();

	const invalidatePurchaseQueries = () => {
		queryClient.invalidateQueries({ queryKey: ["get-purchase-requests"] });
		queryClient.invalidateQueries({ queryKey: ["get-purchase-request-details"] });
		queryClient.invalidateQueries({ queryKey: ["get-purchase-request-products"] });
		queryClient.invalidateQueries({ queryKey: ["quotes-analysis"] });
	};

	const RegisterQuote = useMutation<void, ApiErrorResponse, RegisterQuoteRequest>({
		mutationKey: ["register-quote"],
		mutationFn: (payload: RegisterQuoteRequest) =>
			quoteServices.RegisterQuote(payload),
		onSuccess: invalidatePurchaseQueries,
		retry: 1,
	});

	const UpdateQuote = useMutation<void, ApiErrorResponse, UpdateQuoteRequest>({
		mutationKey: ["update-quote"],
		mutationFn: (payload: UpdateQuoteRequest) =>
			quoteServices.UpdateQuote(payload),
		onSuccess: invalidatePurchaseQueries,
		retry: 1,
	});

	const AcceptQuotationForPurchase = useMutation<
		void,
		ApiErrorResponse,
		AcceptQuotationForPurchaseRequest
	>({
		mutationKey: ["accept-quotation-for-purchase"],
		mutationFn: (payload: AcceptQuotationForPurchaseRequest) =>
			quoteServices.AcceptQuotationForPurchase(payload),
		onSuccess: invalidatePurchaseQueries,
		retry: 1,
	});

	return { RegisterQuote, UpdateQuote, AcceptQuotationForPurchase };
};
