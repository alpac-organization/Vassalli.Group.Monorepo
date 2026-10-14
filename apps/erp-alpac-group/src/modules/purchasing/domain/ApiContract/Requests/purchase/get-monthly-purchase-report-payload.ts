import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetMonthlyPurchaseReportPayload extends BaseRequest {
	year?: number;
	month?: number;
}
