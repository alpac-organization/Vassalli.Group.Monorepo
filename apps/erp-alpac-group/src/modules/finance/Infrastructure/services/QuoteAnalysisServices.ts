import type { IQuoteAnalysis } from "@app/modules/finance/Application/interfaces/IQuoteAnalysis";
import type { IHttpHandler } from "@app/core/ports";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { GetQuoteAnalysisDetailsRequest } from "@app/modules/finance/domain/ApiContract/requests/quote-analysis-detail";
import type { AcceptOfferPurchaseRequest } from "@app/modules/finance/domain/ApiContract/requests/accept-offer-purchase";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
export class QuoteAnalysisServices implements IQuoteAnalysis {
	private readonly httpClient: IHttpHandler;
	constructor(httpClient: IHttpHandler) {
		this.httpClient = httpClient;
	}

	public async GetQuoteAnalysis(payload: GetQuotesAnalysisRequest): Promise<GetRequisitionAccountingReviewsResponse> {
		const { company_id, module_code, page_number, page_size, status, area_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews`;
		const response = await this.httpClient.get<GetRequisitionAccountingReviewsResponse>(url, {
			params: cleanParams({
				page_number,
				page_size,
				status,
				area_id,
			}),
		});
		return response;
	}

	public async GetQuoteAnalysisDetails(payload: GetQuoteAnalysisDetailsRequest): Promise<RequisitionAccountingReviewDetailsDto> {
		const { company_id, module_code, requisition_accounting_review_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews/${requisition_accounting_review_id}`;
		const response = await this.httpClient.get<RequisitionAccountingReviewDetailsDto>(url);
		return response;
	}

	public async accceptQuotationToPurchase(payload: AcceptOfferPurchaseRequest): Promise<void> {
		const { company_id, module_code, quotation_id, purchase_request_item_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}/accept-for-purchase`;
		await this.httpClient.patch<void>(url, { purchase_request_item_id });
	}

	public async sendReviewToManagement(payload: SendReviewToManagementRequest): Promise<void> {

		const {
			company_id,
			module_code,
			requisition_accounting_review_id,
			comments,
			is_approved,
		} = payload;
		
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews/${requisition_accounting_review_id}/send-management-review`;
		await this.httpClient.post<void>(url, {
			comments: comments?.trim() ? comments.trim() : null,
			is_approved,
		});
	}
}
