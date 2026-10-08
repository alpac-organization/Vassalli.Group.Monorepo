import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPositionsRequest extends BaseRequest {
	warehouse_id: string;
	section_id: string;
	tramo_id?: string;
	rack_id?: string;
	status?: string | number;
}
