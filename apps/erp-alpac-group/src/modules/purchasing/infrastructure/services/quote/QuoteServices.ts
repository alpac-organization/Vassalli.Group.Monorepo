import type { IHttpHandler } from "@app/core/ports";
import type { IQuotesServices } from "@app/modules/purchasing/application/interfaces/quote/IQuotesServices";
import type { AcceptQuotationForPurchaseRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/accept-quotation-request";
import type { RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { UpdateQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/update-quote-request";

export class QuoteServices implements IQuotesServices {
	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async RegisterQuote(payload: RegisterQuoteRequest): Promise<void> {
		const { company_id, module_code, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/quotations`;
		await this.apiHandler.post<void>(url, rest);
	}

	async UpdateQuote(payload: UpdateQuoteRequest): Promise<void> {
		const { company_id, module_code, quotation_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}`;
		await this.apiHandler.patch<void>(url, rest);
	}

	async AcceptQuotationForPurchase(
		payload: AcceptQuotationForPurchaseRequest,
	): Promise<void> {
		const {
			company_id,
			module_code,
			quotation_id,
			purchase_request_item_id,
			supplier_selection_justification,
		} = payload;
		const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}/accept-for-purchase`;
		await this.apiHandler.patch<void>(url, {
			purchase_request_item_id,
			supplier_selection_justification,
		});
	}
}
