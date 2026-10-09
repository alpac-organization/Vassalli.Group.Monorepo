import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export interface RequisitionManagementReviewDetailsResponse extends RequisitionManagementReviewDto {
	/** Null/vacío mientras status = Pending. */
	reviewer_user_information: UserInformation | null;
	/** Fuente principal para la pantalla de detalle. */
	purchase_request_details: GetPurchaseRequestDetailResponse;
}
