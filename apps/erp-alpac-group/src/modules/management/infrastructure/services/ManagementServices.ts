import type { IHttpHandler } from "@app/core/ports";
import type { IManagementServices } from "../../application/interfaces/IManagementServices";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewDetailRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-review-detail";
import type { ProcessPurchaseOrderPayload } from "@app/modules/management/domain/ApiContract/requests/process-purchase-order-payload";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type { RequisitionManagementReviewDetailsRequest } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-review-detail";
import { cleanParams } from "@app/shared/utils/object.utils";

export class ManagementServices implements IManagementServices {

	private readonly apiService: IHttpHandler;

	constructor(apiService: IHttpHandler) {
		this.apiService = apiService;
	}

	async GetRequisitionManagementReviews(payload: GetRequisitionManagementReviewsRequest): Promise<GetRequisitionManagementReviewsResponse> {

		const { company_id, module_code, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/requisition-management-reviews`;

		const response = await this.apiService.get<GetRequisitionManagementReviewsResponse>(url, { params: cleanParams(rest) });

		return response;
	}

	async GetRequisitionManagementReviewDetails(payload: GetRequisitionManagementReviewDetailRequest): Promise<RequisitionManagementReviewDetailsRequest> {

		const { company_id, module_code, requisition_management_review_id } = payload;

		const url = `companies/${company_id}/modules/${module_code}/requisition-management-reviews/${requisition_management_review_id}/details`;

		return await this.apiService.get<RequisitionManagementReviewDetailsRequest>(url);
	}

	async ProcessPurchaseOrder(payload: ProcessPurchaseOrderPayload): Promise<void> {

		const { company_id, module_code, requisition_management_review_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/purchase-orders/${requisition_management_review_id}/process`;

		await this.apiService.post<void>(url, rest);
	}
}
