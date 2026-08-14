export interface RegisterLotGroupRequest {
	codes?: string[] | null;
	code_prefix?: string | null;
	start_number?: number | null;
	count?: number | null;
	width_metres: number;
	length_metres: number;
	nominal_rows: number;
	nominal_columns: number;
	allows_stacking: boolean;
	status: string;
	unavailable_reason?: string | null;
}

export interface CreateLotsRequest {
	company_id: string;
	module_code: string;
	section_id: string;
	groups: RegisterLotGroupRequest[];
}