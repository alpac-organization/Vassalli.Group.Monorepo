import type {  } from "@app/shared/interfaces/organization-information/organization-information";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";

export interface RequisitionAccountingReviewDetailsDto extends RequisitionAccountingReviewDto {
  reviewed_by_user_id: string | null;
  purchase_request: GetPurchaseRequestDetailResponse;
}
