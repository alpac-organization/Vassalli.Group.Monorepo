import type { OwnershipFilterValue } from "@app/modules/purchasing/domain/enums/ownership-filter.enum";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseRequestPayload extends BaseRequest {
	code?: string;
	year?: number;
	month?: number;
	branch_id?: string;
	area_id?: string;
	request_type?: PurchaseRequestType;
	priority_level?: PriorityLevelType;
	destination?: PurchaseRequestDestinationType;
	status?: PurchaseRequestStatusType;
	/** 0 = All | 1 = Mine | 2 = Others. Ignored for Operator. */
	ownership?: OwnershipFilterValue;
	page_number?: number;
	page_size?: number;
}
