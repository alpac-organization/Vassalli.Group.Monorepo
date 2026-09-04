import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { PurchaseRequestInformation } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type {
	BranchInformation,
	UserInformation,
	WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";

export interface PurchaseRequestManagementDetails extends PurchaseRequestInformation {
	observations: string | null;
	reason_rejection: string | null;
	branch_information: BranchInformation | null;
	creator_user_information: UserInformation | null;
	reviewer_user_information: UserInformation | null;
	information_from_requesting_area: WorkAreaInformation | null;
}

export interface RequisitionManagementReviewDetailsRequest {
	comments: string | null;
	sent_to_review_at: string;
	status: managementReviewStatusType;
	requisition_management_review_id: string;
	sent_by_user_information: UserInformation;
	reviewer_user_information: UserInformation | null;
	purchase_request_details: PurchaseRequestManagementDetails;
}
