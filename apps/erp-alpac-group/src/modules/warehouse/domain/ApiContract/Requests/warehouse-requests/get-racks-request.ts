export interface GetRacksRequest {
	company_id: string;
	module_code: string;
	section_id: string;
	level_number?: number | null;
	status?: string | null;
	usage_profile?: string | null;
	width_metres?: number | null;
	length_metres?: number | null;
	height_metres?: number | null;
}