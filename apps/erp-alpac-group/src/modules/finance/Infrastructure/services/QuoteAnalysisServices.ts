import type { IQuoteAnalysis } from "@app/modules/finance/Application/interfaces/IQuoteAnalysis";
import type { IHttpHandler } from "@app/core/ports";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { GetQuoteAnalysisDetailsRequest } from "@app/modules/finance/domain/ApiContract/requests/quote-analysis-detail";
import type { AcceptOfferPurchaseRequest } from "@app/modules/finance/domain/ApiContract/requests/accept-offer-purchase";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
import type { AnnulQuoteAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/annul-quote-analysis";
import { cleanParams } from "@app/shared/utils/object.utils";

export class QuoteAnalysisServices implements IQuoteAnalysis {
	private readonly httpClient: IHttpHandler;

	constructor(httpClient: IHttpHandler) {
		this.httpClient = httpClient;
	}

	async GetQuoteAnalysis(payload: GetQuotesAnalysisRequest): Promise<GetRequisitionAccountingReviewsResponse> {
		const { company_id, module_code, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews`;
		return this.httpClient.get<GetRequisitionAccountingReviewsResponse>(url, {
			params: cleanParams(rest),
		});
	}

	async GetQuoteAnalysisDetails(payload: GetQuoteAnalysisDetailsRequest): Promise<RequisitionAccountingReviewDetailsDto> {
		const { company_id, module_code, purchase_requests_reviewed_accounting_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews/${purchase_requests_reviewed_accounting_id}`;
		const response = await this.httpClient.get<RequisitionAccountingReviewDetailsDto>(url);
		console.log(response);
		return response;
	}

	async accceptQuotationToPurchase(payload: AcceptOfferPurchaseRequest): Promise<void> {
		const {
			company_id,
			module_code,
			quotation_id,
			purchase_request_item_id,
			supplier_selection_justification,
			supplier_rejection_justification,
		} = payload;
		const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}/accept-for-purchase`;
		await this.httpClient.patch<void>(url, {
			purchase_request_item_id,
			supplier_selection_justification,
			supplier_rejection_justification,
		});
	}

	async sendReviewToManagement(payload: SendReviewToManagementRequest): Promise<void> {
		const {
			company_id,
			module_code,
			purchase_requests_reviewed_accounting_id,
			comments,
			is_approved,
		} = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews/${purchase_requests_reviewed_accounting_id}/send-management-review`;
		await this.httpClient.post<void>(url, {
			comments: comments?.trim() || null,
			is_approved,
		});
	}

	async annulQuoteAnalysis(payload: AnnulQuoteAnalysisRequest): Promise<void> {
		const {
			company_id,
			module_code,
			purchase_requests_reviewed_accounting_id,
			scope,
			reason,
		} = payload;
		const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews/${purchase_requests_reviewed_accounting_id}/annul`;
		await this.httpClient.post<void>(url, { scope, reason });
	}
}
