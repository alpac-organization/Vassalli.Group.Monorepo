import type { IQuoteAnalysis } from "@app/modules/finance/Application/interfaces/IQuoteAnalysis";
import type { IHttpHandler } from "@app/core/ports";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import { cleanParams } from "@app/shared/utils/object.utils";

export class QuoteAnalysisServices implements IQuoteAnalysis {
  private readonly httpClient: IHttpHandler;
  constructor(httpClient: IHttpHandler) {
    this.httpClient = httpClient;
  }

  public async GetQuoteAnalysis(
    payload: GetQuotesAnalysisRequest,
  ): Promise<GetRequisitionAccountingReviewsResponse> {
    const { company_id, module_code, page_number, page_size, status, area_id } =
      payload;
    const url = `/companies/${company_id}/modules/${module_code}/requisition-accounting-reviews`;
    const response =
      await this.httpClient.get<GetRequisitionAccountingReviewsResponse>(url, {
        params: cleanParams({
          page_number,
          page_size,
          status,
          area_id,
        }),
      });
    return response;
  }
}
