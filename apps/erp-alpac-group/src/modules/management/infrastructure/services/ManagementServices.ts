import type { IHttpHandler } from "@app/core/ports";
import type { IManagementServices } from "../../application/interfaces/IManagementServices";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewDetailRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-review-detail";
import type { SendToRequest } from "@app/modules/management/domain/ApiContract/requests/send-to";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export class ManagementServices implements IManagementServices {
  private readonly apiService: IHttpHandler;

  constructor(apiService: IHttpHandler) {
    this.apiService = apiService;
  }

  async GetRequisitionManagementReviews(
    payload: GetRequisitionManagementReviewsRequest,
  ): Promise<GetRequisitionManagementReviewsResponse> {
    const { company_id, module_code, ...rest } = payload;

    const url = `companies/${company_id}/modules/${module_code}/requisition-management-reviews`;

    const response =
      await this.apiService.get<GetRequisitionManagementReviewsResponse>(url, {
        params: cleanParams(rest),
      });

    return response;
  }

  async GetRequisitionManagementReviewDetail(
    payload: GetRequisitionManagementReviewDetailRequest,
  ): Promise<any> {
    const { company_id, module_code, requisition_management_review_id } =
      payload;
    const url = `companies/${company_id}/modules/${module_code}/requisition-management-reviews/${requisition_management_review_id}`;
    return await this.apiService.get<any>(url);
  }

  async SendTo(payload: SendToRequest): Promise<void> {
    const { company_id, module_code, requisition_management_review_id } =
      payload;
    const url = `companies/${company_id}/modules/${module_code}/requisition-management-reviews/${requisition_management_review_id}/send`;
    await this.apiService.post<void>(url);
  }
}
