import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateLotRequest extends BaseRequest {
	warehouse_id: string;
	section_id: string;
	lot_id: string;
	code?: string | null;
	width_metres?: number | null;
	length_metres?: number | null;
	allows_stacking?: boolean | null;
	status?: string | number | null;
	unavailable_reason?: string | null;
}
